import sha1 from 'sha1';
import { v4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const { authorization } = req.headers;
    const base64Cred = authorization.replace('Basic ', '');
    const cred = Buffer.from(base64Cred, 'base64').toString(
      'utf-8',
    );
    const credentials = cred.split(':');
    const email = credentials[0];
    const password = credentials[1];
    // console.log(email, password);

    const users = dbClient.db.collection('users');
    const user = await users.findOne({ email });

    if (user && sha1(password) === user.password) {
      const token = v4();
      const key = `auth_${token}`;
      const reply = await redisClient.set(key, user._id, 86400);
      console.log(reply);
      return res.status(200).json({
        token,
      });
    }
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;
