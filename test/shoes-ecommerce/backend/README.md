# Shoes E-commerce Backend

This is the backend for the Shoes E-commerce application. It provides API endpoints for product management, user authentication, order processing, and more.

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── data/             # Seed data
│   └── productSeed.js # Seed data for products
├── middleware/       # Custom middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── utils/            # Utility functions
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Dependencies and scripts
└── server.js         # Entry point
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Database Seeding

To seed the database with initial product data:

```
npm run data:import
```

This will import the 40 shoe products defined in `data/productSeed.js`.

## Available API Endpoints

- **Products**
  - GET /api/products - Get all products
  - GET /api/products/:id - Get a product by ID
  - POST /api/products - Create a product (admin only)
  - PUT /api/products/:id - Update a product (admin only)
  - DELETE /api/products/:id - Delete a product (admin only)

- **Users**
  - POST /api/users/login - User login
  - POST /api/users/register - User registration
  - GET /api/users/profile - Get user profile
  - PUT /api/users/profile - Update user profile
  - GET /api/users - Get all users (admin only)
  - DELETE /api/users/:id - Delete user (admin only)

- **Orders**
  - POST /api/orders - Create a new order
  - GET /api/orders/user - Get logged in user's orders
  - GET /api/orders/:id - Get an order by ID
  - PUT /api/orders/:id/pay - Update order to paid
  - PUT /api/orders/:id/deliver - Update order to delivered (admin only)
  - GET /api/orders - Get all orders (admin only)

## Technologies Used

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens for authentication
- bcrypt for password hashing 