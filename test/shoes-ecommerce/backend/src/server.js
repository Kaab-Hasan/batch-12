import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import User from './models/userModel.js';
import users from '../data/userSeed.js';

// Load environment variables
dotenv.config();

const app = express();
// Use environment variable port or default to 8000
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins temporarily for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' })); // Increase limit for large images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Additional CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'Server is running correctly', 
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Shoes E-Commerce API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error(`Server error: ${err.message}`);
  process.exit(1);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check for products
    try {
      const Product = mongoose.model('Product');
      const productCount = await Product.countDocuments();
      console.log(`Database has ${productCount} products`);
    } catch (error) {
      console.error('Error counting products:', error.message);
    }
    
    // Seed mock users if in development mode
    if (process.env.NODE_ENV !== 'production') {
      try {
        // Check if the demo users exist
        const demoUser = await User.findOne({ email: 'demo@example.com' });
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        
        // If both demo users don't exist, add them
        if (!demoUser || !adminUser) {
          console.log('Adding mock users for testing...');
          
          // Add each user if they don't exist
          for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            
            if (!existingUser) {
              await User.create(user);
              console.log(`Mock user added: ${user.email}`);
            }
          }
          
          console.log('Mock users added successfully!');
          console.log('Demo User: demo@example.com / demo123456');
          console.log('Admin User: admin@example.com / admin123456');
        }
      } catch (error) {
        console.error('Error seeding mock users:', error);
      }
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Server running in offline mode - database features will not work');
  });

export default app; 