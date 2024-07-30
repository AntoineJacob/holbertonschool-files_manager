import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Handle Redis errors
    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  isAlive() {
    // Check if the connection is alive
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          console.error('Error getting value from Redis:', err);
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          console.error('Error setting value in Redis:', err);
          return reject(err);
        }
        resolve();
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error('Error deleting value from Redis:', err);
          return reject(err);
        }
        resolve();
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
