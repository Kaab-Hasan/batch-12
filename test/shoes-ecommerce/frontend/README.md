# ShoeStyle E-Commerce Platform

A full-stack e-commerce application for selling shoes, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Product Catalog**: Browse shoes by category, search, and filter
- **Shopping Cart**: Add products to cart, adjust quantities
- **Checkout Process**: Secure payment processing with Stripe
- **Order Management**: Track orders and order history
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Mobile-friendly UI with Material-UI

## Tech Stack

### Frontend
- React with Vite for fast development
- Material-UI for UI components and styling
- React Router for navigation
- Context API for state management
- Formik and Yup for form validation
- Stripe Elements for payment processing

### Backend
- Node.js and Express.js for the API
- MongoDB with Mongoose for database
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage
- Stripe API for payments

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account

### Setup

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/shoes-ecommerce.git
   cd shoes-ecommerce
   ```

2. **Install dependencies**
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the backend directory:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

   Create a `.env.local` file in the frontend directory:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Run the application**
   ```
   # Run backend
   cd backend
   npm run dev

   # Run frontend in a separate terminal
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173 (default Vite port)
   - Backend API: http://localhost:5000

## Project Structure

```
shoes-ecommerce/
├── backend/                 # Backend Express API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Express app entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
├── frontend/                # Frontend React app
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Application pages
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main component
│   │   ├── main.jsx         # Entry point
│   │   └── theme.js         # MUI theme configuration
│   ├── .env.local           # Frontend environment variables
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation
```

## API Endpoints

### Auth
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get bestselling products
- `GET /api/products/new-arrivals` - Get new arrivals

### Orders
- `POST /api/orders` - Create an order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Checkout
- `POST /api/checkout/create-payment-intent` - Create Stripe payment intent
- `POST /api/checkout/confirm-payment` - Confirm payment
- `POST /api/checkout/webhook` - Stripe webhook endpoint

## License

MIT 