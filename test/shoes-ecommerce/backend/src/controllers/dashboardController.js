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
    
    // Get total revenue (sum of all paid orders' totalPrice)
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['processing', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    // Get recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Convert to a more frontend-friendly format
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order._id,
      customer: order.user ? order.user.name : 'Guest',
      date: order.createdAt,
      total: order.totalPrice,
      status: order.status
    }));
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format data for frontend
    const formattedOrdersByStatus = {};
    ordersByStatus.forEach(item => {
      formattedOrdersByStatus[item._id] = item.count;
    });
    
    // Get popular products (based on orders)
    const popularProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          sold: { $sum: '$orderItems.quantity' },
          price: { $first: '$orderItems.price' }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);
    
    // Return dashboard data
    res.json({
      totalCustomers: userCount,
      totalProducts: productCount,
      totalOrders: orderCount,
      totalSales: revenue.length > 0 ? revenue[0].total : 0,
      recentOrders: formattedRecentOrders,
      ordersByStatus: formattedOrdersByStatus,
      popularProducts: popularProducts
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getDashboardStats
}; 