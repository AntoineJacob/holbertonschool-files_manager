import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const redisKey = `auth_${token}`;

    try {
      const userId = await redisClient.client.get(redisKey);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const usersCollection = dbClient.db.collection('users');
      const user = await usersCollection.findOne({ _id: new MongoClient.ObjectId(userId) }, { projection: { email: 1 } });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(200).json({ id: user._id.toString(), email: user.email });
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
