import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import users from '../../data/userSeed.js';

// Load environment variables
dotenv.config();

// Function to seed database with mock users
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Check if there are already users in the database
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      // Check if the demo users exist
      const demoUser = await User.findOne({ email: 'demo@example.com' });
      const adminUser = await User.findOne({ email: 'admin@example.com' });
      
      // If both demo users exist, just log and exit
      if (demoUser && adminUser) {
        console.log('Mock users already exist in the database');
        await mongoose.disconnect();
        return;
      }
      
      // If they don't exist, add them
      console.log('Adding mock users to the database...');
      
      // Add each user if they don't exist
      for (const user of users) {
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create(user);
          console.log(`User added: ${user.email}`);
        }
      }
    } else {
      // No users, add the seed data
      console.log('Seeding users to empty database...');
      await User.insertMany(users);
    }
    
    console.log('User seeding completed');
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers(); 