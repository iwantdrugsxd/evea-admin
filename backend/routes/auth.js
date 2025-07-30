// routes/auth.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authValidation } = require('../middleware/validation');
const router = express.Router();

// Rate limiting middleware for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    message: 'Too many login attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public authentication routes
router.post('/signup', 
  authLimiter,
  authValidation.validateSignup, 
  authController.signup
);

router.post('/login', 
  loginLimiter,
  authValidation.validateLogin, 
  authController.login
);

router.post('/logout', 
  authController.logout
);

// Protected routes (require valid token)
router.get('/me', 
  authController.getMe
);

router.get('/check', 
  authController.checkAuth
);

// Test route for debugging
router.get('/test', 
  authController.test
);

// Future routes (placeholder for now)
router.post('/forgot-password', 
  authLimiter,
  authValidation.validateForgotPassword, 
  (req, res) => {
    res.status(501).json({ 
      message: 'Forgot password feature not implemented yet' 
    });
  }
);

router.post('/reset-password', 
  authLimiter,
  authValidation.validateResetPassword, 
  (req, res) => {
    res.status(501).json({ 
      message: 'Reset password feature not implemented yet' 
    });
  }
);

router.get('/verify-email/:token', 
  (req, res) => {
    res.status(501).json({ 
      message: 'Email verification feature not implemented yet' 
    });
  }
);

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({
    service: 'auth',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

module.exports = router;