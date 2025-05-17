import express from 'express';
import {
  createStripePaymentIntent,
  confirmPaymentSuccess,
  handleStripeWebhook
} from '../controllers/checkoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stripe webhook - this needs raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.post('/create-payment-intent', protect, createStripePaymentIntent);
router.post('/confirm-payment', protect, confirmPaymentSuccess);

export default router; 