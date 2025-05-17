import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const userCount = await User.countDocuments();
    
    // Get total products count
    const productCount = await Product.countDocuments();
    
    // Get total orders count
    const orderCount = await Order.countDocuments();
    
    // Get total revenue (sum of all orders' totalPrice)
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    // Get recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format data for frontend
    const formattedOrdersByStatus = {};
    ordersByStatus.forEach(item => {
      formattedOrdersByStatus[item._id] = item.count;
    });
    
    // Return dashboard data
    res.json({
      userCount,
      productCount,
      orderCount,
      revenue: revenue.length > 0 ? revenue[0].total : 0,
      recentOrders,
      ordersByStatus: formattedOrdersByStatus
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getDashboardStats
}; 