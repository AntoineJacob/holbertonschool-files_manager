import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.replace('Basic ', '');
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    
    try {
      const usersCollection = dbClient.db.collection('users');
      const user = await usersCollection.findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      const redisKey = `auth_${token}`;

      await redisClient.client.set(redisKey, user._id.toString(), 'EX', 86400); // 24 hours expiry

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error during connect:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const redisKey = `auth_${token}`;

    try {
      const result = await redisClient.client.del(redisKey);

      if (result === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Error during disconnect:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AuthController;
