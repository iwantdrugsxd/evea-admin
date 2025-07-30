const Vendor = require('../models/Vendor');
const Order = require('../models/Order');

const getAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.categories = category;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await Vendor.find(query)
      .select('-documents -banking')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Vendor.countDocuments(query);

    res.json({
      vendors,
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

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get vendor's orders for performance metrics
    const orders = await Order.find({ vendor: vendor._id })
      .select('status pricing.totalAmount createdAt')
      .sort({ createdAt: -1 });

    const performance = {
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.pricing.totalAmount, 0),
      avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.pricing.totalAmount, 0) / orders.length : 0
    };

    res.json({
      vendor,
      performance,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.status = 'approved';
    vendor.isActive = true;
    vendor.approvalHistory.push({
      status: 'approved',
      notes,
      adminId: req.user.id,
      date: new Date()
    });

    await vendor.save();

    // Send approval email to vendor
    // await sendVendorApprovalEmail(vendor.email, vendor.businessName);

    res.json({ message: 'Vendor approved successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.status = 'rejected';
    vendor.isActive = false;
    vendor.approvalHistory.push({
      status: 'rejected',
      notes: `${reason}: ${notes}`,
      adminId: req.user.id,
      date: new Date()
    });

    await vendor.save();

    // Send rejection email to vendor
    // await sendVendorRejectionEmail(vendor.email, vendor.businessName, reason);

    res.json({ message: 'Vendor rejected successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vendor = await Vendor.findByIdAndUpdate(id, updates, { new: true });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor updated successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  updateVendor
};