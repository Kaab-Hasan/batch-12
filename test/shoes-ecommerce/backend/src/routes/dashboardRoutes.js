import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.route('/stats').get(protect, admin, getDashboardStats);

export default router; 