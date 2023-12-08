import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Missing email',
      });
    }
    if (!password) {
      return res.status(400).json({
        error: 'Missing password',
      });
    }

    const users = dbClient.db.collection('users');
    const emailChecker = await users.findOne({ email });
    // console.log(emailChecker);
    if (emailChecker) {
      return res.status(400).json({
        error: 'Already exist',
      });
    }

    const hashPwd = sha1(password);
    const newUser = await users.insertOne({ email, password: hashPwd });
    return res.status(201).json({
      id: newUser.insertedId,
      email,
    });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    console.log(token);
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    console.log(userId);
    const userDb = dbClient.db.collection('users');
    const user = await userDb.findOne({ _id: new ObjectId(userId) });
    if (user) {
      return res.status(200).json({
        id: user._id,
        email: user.email,
      });
    }
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
}

export default UsersController;
