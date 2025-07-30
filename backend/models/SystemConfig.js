const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  platform: {
    name: {
      type: String,
      default: 'EVEA - Event Planning Platform'
    },
    description: {
      type: String,
      default: 'Your trusted partner for seamless event planning and vendor management'
    },
    url: String,
    supportEmail: String,
    contactPhone: String
  },
  business: {
    currency: {
      type: String,
      default: 'INR'
    },
    currencySymbol: {
      type: String,
      default: '₹'
    },
    taxRate: {
      type: Number,
      default: 18
    },
    commissionRate: {
      type: Number,
      default: 15
    }
  },
  features: {
    enableGuestRegistration: {
      type: Boolean,
      default: true
    },
    enableVendorRegistration: {
      type: Boolean,
      default: true
    },
    enableReviews: {
      type: Boolean,
      default: true
    },
    enableRatings: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    enableSocialLogin: {
      type: Boolean,
      default: false
    }
  },
  email: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPassword: String,
    fromName: String,
    fromEmail: String
  },
  security: {
    passwordMinLength: {
      type: Number,
      default: 8
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    lockoutDuration: {
      type: Number,
      default: 30
    },
    sessionTimeout: {
      type: Number,
      default: 60
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    }
  },
  uploads: {
    maxFileSize: {
      type: Number,
      default: 10
    },
    allowedTypes: {
      type: [String],
      default: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
    },
    maxImagesPerVendor: {
      type: Number,
      default: 20
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);