const Order = require('../models/Order');
const Vendor = require('../models/Vendor');

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('vendor', 'businessName contactPerson')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendor', 'businessName contactPerson email phone address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.timeline.push({
      status,
      description: notes || `Order status updated to ${status}`,
      updatedBy: req.user.id
    });

    await order.save();

    // Send status update notification
    // await sendOrderStatusUpdate(order.customer.email, order.orderId, status);

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, amount, method } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.payment.status = paymentStatus;
    order.payment.transactions.push({
      transactionId,
      amount,
      method,
      status: 'success',
      date: new Date()
    });

    // Update remaining amount
    const totalPaid = order.payment.transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
    
    order.pricing.remainingAmount = order.pricing.totalAmount - totalPaid;

    await order.save();

    res.json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
};
