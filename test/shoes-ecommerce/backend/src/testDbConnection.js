import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', process.env.MONGODB_URI ? 'Connection string found' : 'CONNECTION STRING NOT FOUND');

// If environment variable not found, provide a test connection string
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://your_test_connection_here';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  }); 