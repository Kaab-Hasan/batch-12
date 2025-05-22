import axios from 'axios';
import { API_URL } from '../config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API calls
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching products';
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching product details';
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/products/featured`, { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching featured products';
    }
  },

  // Get best seller products
  getBestSellerProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/products/bestsellers`, { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching best seller products';
    }
  },

  // Get new arrival products
  getNewArrivalProducts: async (limit = 8) => {
    try {
      const response = await api.get(`/products/new-arrivals`, { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching new arrival products';
    }
  },
};

// Order API calls
export const orderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error creating order';
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/user');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching your orders';
    }
  },

  // Get a single order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching order details';
    }
  },

  // Update order to paid
  updateOrderToPaid: async (id, paymentResult) => {
    try {
      const response = await api.put(`/orders/${id}/pay`, paymentResult);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error updating payment status';
    }
  },
};

// Checkout API calls
export const checkoutAPI = {
  // Create payment intent with Stripe
  createPaymentIntent: async (amount, orderId) => {
    try {
      const response = await api.post('/checkout/create-payment-intent', {
        amount,
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error setting up payment';
    }
  },

  // Confirm payment success
  confirmPayment: async (paymentIntentId, orderId) => {
    try {
      const response = await api.post('/checkout/confirm-payment', {
        paymentIntentId,
        orderId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error confirming payment';
    }
  },
};

// Admin API calls
export const adminAPI = {
  // Get all users (admin only)
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching users';
    }
  },

  // Delete a user (admin only)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error deleting user';
    }
  },

  // Get all orders (admin only)
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error fetching orders';
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error updating order status';
    }
  },

  // Create a product (admin only)
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      // Append images if they exist
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error creating product';
    }
  },

  // Update a product (admin only)
  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      // Append new images if they exist
      if (productData.newImages && productData.newImages.length > 0) {
        productData.newImages.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error updating product';
    }
  },

  // Delete a product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error deleting product';
    }
  },

  // Delete a product image (admin only)
  deleteProductImage: async (productId, imageIndex) => {
    try {
      const response = await api.delete(`/products/${productId}/images/${imageIndex}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error deleting image';
    }
  },
};

export default api; 