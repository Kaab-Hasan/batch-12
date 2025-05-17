import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import { productSeed } from '../../data/productSeed.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding products');
    
    try {
      // Clear existing products
      await Product.deleteMany({});
      console.log('Cleared existing products');
      
      // Insert new products
      const createdProducts = await Product.insertMany(productSeed);
      console.log(`Added ${createdProducts.length} products to database`);
      
      console.log('Seeding completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding products:', error.message);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }); 