const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  service: {
    name: {
      type: String,
      required: true
    },
    category: String,
    packageSelected: String
  },
  event: {
    type: {
      type: String,
      required: true,
      enum: ['wedding', 'birthday', 'anniversary', 'corporate', 'festival', 'other']
    },
    date: {
      type: Date,
      required: true
    },
    time: String,
    duration: Number, // in hours
    guestCount: {
      type: Number,
      required: true
    },
    location: {
      venue: String,
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: String,
      pincode: String
    }
  },
  requirements: {
    type: String,
    maxlength: 1000
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    taxes: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    advanceAmount: {
      type: Number,
      required: true
    },
    remainingAmount: {
      type: Number,
      required: true
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'advance_paid', 'partially_paid', 'fully_paid', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cash']
    },
    transactions: [{
      transactionId: String,
      amount: Number,
      method: String,
      status: String,
      gateway: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  communication: [{
    from: String,
    to: String,
    message: String,
    type: {
      type: String,
      enum: ['email', 'sms', 'call', 'message']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  cancellation: {
    reason: String,
    cancelledBy: String,
    cancellationDate: Date,
    refundAmount: Number,
    refundStatus: String
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewDate: Date
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate order ID
orderSchema.pre('save', function(next) {
  if (!this.orderId) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `ORD-${year}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);