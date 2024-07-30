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
          return reject(err); // Ensures a return value in case of error
        }
        return resolve(reply); // Ensures a return value in case of success
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          console.error('Error setting value in Redis:', err);
          return reject(err); // Ensures a return value in case of error
        }
        return resolve(); // Ensures a return value in case of success
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error('Error deleting value from Redis:', err);
          return reject(err); // Ensures a return value in case of error
        }
        return resolve(); // Ensures a return value in case of success
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
