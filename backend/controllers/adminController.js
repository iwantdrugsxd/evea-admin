const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    // Get current month stats
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const currentMonthRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ isActive: true });
    const pendingApprovals = await Vendor.countDocuments({ status: 'pending' });

    // Get previous month stats for comparison
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: startOfMonth }
    });

    const lastMonthRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    const stats = {
      orders: {
        current: currentMonthOrders,
        previous: lastMonthOrders,
        growth: lastMonthOrders > 0 ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1) : 0
      },
      revenue: {
        current: currentMonthRevenue[0]?.total || 0,
        previous: lastMonthRevenue[0]?.total || 0,
        growth: lastMonthRevenue[0]?.total > 0 ? 
          ((currentMonthRevenue[0]?.total - lastMonthRevenue[0]?.total) / lastMonthRevenue[0]?.total * 100).toFixed(1) : 0
      },
      vendors: {
        total: totalVendors,
        active: activeVendors,
        pending: pendingApprovals
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('vendor', 'businessName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderId customer.name vendor status createdAt pricing.totalAmount');

    // Get recent vendor registrations
    const recentVendors = await Vendor.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('businessName contactPerson status createdAt');

    const activities = [];

    // Add order activities
    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        title: 'New Order Placed',
        description: `${order.customer.name} placed order ${order.orderId}`,
        vendor: order.vendor?.businessName,
        amount: order.pricing.totalAmount,
        status: order.status,
        timestamp: order.createdAt
      });
    });

    // Add vendor activities
    recentVendors.forEach(vendor => {
      activities.push({
        type: 'vendor',
        title: 'Vendor Registration',
        description: `${vendor.businessName} submitted application`,
        contact: vendor.contactPerson,
        status: vendor.status,
        timestamp: vendor.createdAt
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(activities.slice(0, limit));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRevenueChart = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    let startDate;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$pricing.totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getRevenueChart
};