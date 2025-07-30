// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy for email/password authentication
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    console.log('Local strategy attempting login for:', email);
    
    // Find user by email and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('User not found:', email);
      return done(null, false, { 
        message: 'Invalid email or password' 
      });
    }

    console.log('User found:', user.email, 'Active:', user.isActive);

    // Check if account is locked
    if (user.isLocked) {
      console.log('Account locked:', user.email);
      return done(null, false, { 
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('Account inactive:', user.email);
      return done(null, false, { 
        message: 'Account is not active. Please contact support.' 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for:', user.email);
      
      // Increment login attempts
      await user.incLoginAttempts();
      
      return done(null, false, { 
        message: 'Invalid email or password' 
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $unset: {
          loginAttempts: 1,
          lockUntil: 1
        }
      });
    }

    console.log('Login successful for:', user.email);
    return done(null, user);

  } catch (error) {
    console.error('Local strategy error:', error);
    return done(error);
  }
}));

// Google OAuth Strategy (if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth callback for:', profile.emails[0].value);
      
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        // User exists with Google ID
        console.log('Existing Google user found:', user.email);
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        console.log('Linking Google account to existing user:', user.email);
        user.googleId = profile.id;
        user.isVerified = true;
        await user.save();
        return done(null, user);
      }
      
      // Create new user from Google profile
      console.log('Creating new user from Google profile:', profile.emails[0].value);
      user = new User({
        googleId: profile.id,
        name: profile.displayName || profile.emails[0].value.split('@')[0],
        email: profile.emails[0].value,
        isVerified: true,
        isActive: true,
        role: 'admin', // Default role for Google sign-ins
        profile: {
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        }
      });
      
      await user.save();
      console.log('New Google user created:', user.email);
      return done(null, user);
      
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error);
    }
  }));
}

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    message: 'Authentication required' 
  });
};

// Middleware to ensure user has specific role
const ensureRole = (roles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }
    
    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role(s): ${userRoles.join(', ')}` 
      });
    }
    
    next();
  };
};

// Middleware to ensure user is admin
const ensureAdmin = ensureRole(['admin', 'super_admin']);

// Middleware to ensure user is vendor
const ensureVendor = ensureRole(['vendor']);

// Export passport and middleware
module.exports = {
  passport,
  ensureAuthenticated,
  ensureRole,
  ensureAdmin,
  ensureVendor
};