import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getFeaturedProducts,
  getBestSellerProducts,
  getNewArrivalProducts
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadMultiple, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellerProducts);
router.get('/new-arrivals', getNewArrivalProducts);
router.get('/new', getNewArrivalProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, uploadMultiple, handleMulterError, createProduct);
router.put('/:id', protect, admin, uploadMultiple, handleMulterError, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.delete('/:id/images/:imageIndex', protect, admin, deleteProductImage);

export default router; 