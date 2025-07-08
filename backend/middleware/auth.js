const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Admin user ID constant
const ADMIN_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

// JWT token validation schema
const tokenSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin']).default('admin'),
  iat: z.number(),
  exp: z.number()
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Validate token structure
    const validatedToken = tokenSchema.parse(decoded);
    
    // Check if token is expired
    if (Date.now() >= validatedToken.exp * 1000) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }

    // Only allow admin access
    if (validatedToken.userId !== ADMIN_USER_ID) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only admin can access this resource'
      });
    }

    req.user = validatedToken;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is not valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid token format'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const validatedToken = tokenSchema.parse(decoded);
    
    if (Date.now() >= validatedToken.exp * 1000) {
      req.user = null;
      return next();
    }

    // Only set user if it's admin
    if (validatedToken.userId === ADMIN_USER_ID) {
      req.user = validatedToken;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Admin-only authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please login to access this resource'
    });
  }

  if (req.user.userId !== ADMIN_USER_ID) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Only admin can access this resource'
    });
  }

  next();
};

// Resource ownership middleware (admin owns all resources)
const authorizeResource = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    // Admin can access all resources
    if (req.user.userId === ADMIN_USER_ID) {
      return next();
    }

    return res.status(403).json({
      error: 'Access denied',
      message: 'Only admin can access this resource'
    });
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authorizeAdmin,
  authorizeResource
}; 