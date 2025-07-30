// middleware/validation.js
const { body } = require('express-validator');

const authValidation = {
  // Signup validation rules - matches what frontend sends
  validateSignup: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s\-'\.]+$/)
      .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and dots'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .isLength({ max: 255 })
      .withMessage('Email is too long'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    // Note: confirmPassword is handled in frontend, not validated here
    // But we can add it if needed
    body('confirmPassword')
      .optional()
      .custom((value, { req }) => {
        if (value && value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    
    body('role')
      .optional()
      .isIn(['admin', 'vendor', 'customer', 'super_admin'])
      .withMessage('Invalid role specified')
  ],

  // Login validation rules - matches what frontend sends  
  validateLogin: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 1, max: 128 })
      .withMessage('Password length invalid')
  ],

  // Forgot password validation
  validateForgotPassword: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
  ],

  // Reset password validation
  validateResetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required')
      .isLength({ min: 32 })
      .withMessage('Invalid reset token format'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
  ],

  // Change password validation (for authenticated users)
  validateChangePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 8, max: 128 })
      .withMessage('New password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('confirmNewPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('New password confirmation does not match new password');
        }
        return true;
      })
  ],

  // Update profile validation
  validateUpdateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s\-'\.]+$/)
      .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and dots'),
    
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .matches(/^[+]?[\d\s\-\(\)]+$/)
      .withMessage('Please provide a valid phone number')
      .isLength({ min: 10, max: 20 })
      .withMessage('Phone number must be between 10 and 20 characters')
  ]
};

// Common validation rules
const commonValidation = {
  // Validate MongoDB ObjectId
  validateObjectId: (paramName = 'id') => [
    body(paramName)
      .matches(/^[0-9a-fA-F]{24}$/)
      .withMessage(`Invalid ${paramName} format`)
  ],

  // Validate pagination parameters
  validatePagination: [
    body('page')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Page must be a positive integer between 1 and 1000'),
    
    body('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be a positive integer between 1 and 100'),
    
    body('sort')
      .optional()
      .isIn(['createdAt', '-createdAt', 'name', '-name', 'email', '-email'])
      .withMessage('Invalid sort parameter')
  ],

  // Validate search parameters
  validateSearch: [
    body('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search term must be between 1 and 100 characters')
      .escape() // Prevent XSS
  ]
};

module.exports = {
  authValidation,
  commonValidation
};