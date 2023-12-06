import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    const redisState = redisClient.isAlive();
    const dbState = dbClient.isAlive();

    return res.status(200).json({
      redis: redisState,
      db: dbState,
    });
  }

  static async getStats(req, res) {
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();

    return res.status(200).json({
      users: userCount,
      files: fileCount,
    });
  }
}

export default AppController;
