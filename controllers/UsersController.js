import crypto from 'crypto';
import dbClient from '../utils/db'; // Ensure this path is correct

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const usersCollection = dbClient.db.collection('users');

      // Check if the email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exists' });
      }

      // Hash the password using SHA1
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // Insert the new user into the database
      const result = await usersCollection.insertOne({ email, password: hashedPassword });
      const newUser = result.insertedId; // Get the newly inserted user ID

      // Respond with the newly created user
      return res.status(201).json({ id: newUser, email });
    } catch (error) {
      // Log the error and respond with a 500 status code
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
