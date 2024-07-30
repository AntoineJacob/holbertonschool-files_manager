import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    
    this.url = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.db = null;

    // Connect to MongoDB
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  isAlive() {
    // Check if the connection to MongoDB is alive
    return this.db !== null;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('Not connected to MongoDB');
    }
    const usersCollection = this.db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('Not connected to MongoDB');
    }
    const filesCollection = this.db.collection('files');
    return filesCollection.countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
