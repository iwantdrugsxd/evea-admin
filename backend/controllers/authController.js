// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'evea_secret_key_change_in_production';

// Generate JWT Token
const generateToken = (userId, email, role, name) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role, 
      name 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  return null;
};

const authController = {
  // Register new user
  signup: async (req, res) => {
    try {
      console.log('🔥 Signup request received:', req.body);
      
      // Check for validation errors
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      const { name, email, password, role = 'admin' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(409).json({
          message: 'User already exists with this email'
        });
      }

      // Create new user
      const user = new User({
        name,
        email: email.toLowerCase(),
        password,
        role,
        isActive: true,
        isVerified: true // For development
      });

      await user.save();
      console.log('✅ User created successfully:', user.email);

      // Generate JWT token
      const token = generateToken(user._id, user.email, user.role, user.name);

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: user.toJSON()
      });

    } catch (error) {
      console.error('💥 Signup error:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => ({
          field: e.path,
          message: e.message
        }));
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          message: 'User already exists with this email'
        });
      }

      res.status(500).json({
        message: 'Internal server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      console.log('🔥 Login request received:', req.body.email);
      
      // Check for validation errors
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      const { email, password } = req.body;

      // Find user by email and include password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        console.log('❌ Account inactive:', email);
        return res.status(401).json({
          message: 'Account is not active'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = generateToken(user._id, user.email, user.role, user.name);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      console.log('✅ Login successful:', user.email);

      res.json({
        message: 'Login successful',
        token,
        user: user.toJSON()
      });

    } catch (error) {
      console.error('💥 Login error:', error);
      res.status(500).json({
        message: 'Internal server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Logout user
  logout: (req, res) => {
    try {
      console.log('🔥 Logout request received');
      
      // In a session-based system, you would destroy the session here
      // For JWT, we just return success (client should delete the token)
      
      res.json({
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('💥 Logout error:', error);
      res.status(500).json({
        message: 'Internal server error during logout'
      });
    }
  },

  // Get current user profile
  getMe: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ 
          message: 'No authorization header provided' 
        });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ 
          message: 'No token provided' 
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ 
          message: 'User not found' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          message: 'Account is not active' 
        });
      }

      res.json({ 
        user: user.toJSON() 
      });
    } catch (error) {
      console.error('💥 Get me error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token' 
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired' 
        });
      }

      res.status(500).json({ 
        message: 'Internal server error' 
      });
    }
  },

  // Check authentication status
  checkAuth: (req, res) => {
    try {
      console.log('🔥 Auth check request');
      
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.json({
          isAuthenticated: false,
          user: null,
          message: 'No authorization header'
        });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.json({
          isAuthenticated: false,
          user: null,
          message: 'No token provided'
        });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
          isAuthenticated: true,
          user: {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
          },
          message: 'Authenticated'
        });
      } catch (tokenError) {
        res.json({
          isAuthenticated: false,
          user: null,
          message: 'Invalid token'
        });
      }
    } catch (error) {
      console.error('💥 Check auth error:', error);
      res.status(500).json({
        isAuthenticated: false,
        user: null,
        message: 'Internal server error'
      });
    }
  },

  // Test endpoint
  test: (req, res) => {
    console.log('🔥 Test route hit');
    res.json({
      message: 'Auth controller is working!',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV
    });
  }
};

module.exports = authController;