const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ['catering', 'photography', 'decoration', 'venue', 'entertainment', 'planning', 'transport', 'other']
  },
  basePrice: {
    type: Number,
    required: true
  },
  packages: [{
    name: String,
    description: String,
    price: Number,
    features: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true,
    enum: ['individual', 'company', 'partnership']
  },
  categories: [{
    type: String,
    enum: ['catering', 'photography', 'decoration', 'venue', 'entertainment', 'planning', 'transport', 'other']
  }],
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  serviceArea: {
    type: [String],
    required: true
  },
  services: [serviceSchema],
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    eventType: String,
    eventDate: Date
  }],
  documents: {
    businessLicense: {
      filename: String,
      url: String,
      uploadDate: Date
    },
    taxCertificate: {
      filename: String,
      url: String,
      uploadDate: Date
    },
    insurance: {
      filename: String,
      url: String,
      uploadDate: Date
    }
  },
  banking: {
    accountHolderName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true
    },
    panNumber: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  approvalHistory: [{
    status: String,
    notes: String,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  performance: {
    totalOrders: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    cancelledOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: Date,
  yearsInBusiness: Number,
  employeeCount: Number,
  registrationNumber: String,
  taxId: String
}, {
  timestamps: true
});

// Calculate completion rate
vendorSchema.virtual('completionRate').get(function() {
  if (this.performance.totalOrders === 0) return 0;
  return (this.performance.completedOrders / this.performance.totalOrders) * 100;
});

module.exports = mongoose.model('Vendor', vendorSchema);