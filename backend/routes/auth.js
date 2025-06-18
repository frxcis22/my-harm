const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { userRegistrationSchema, userLoginSchema, passwordChangeSchema } = require('../validations/schemas');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Mock user database (in production, use a real database)
let users = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Francis Bockarie',
    email: 'francis@cyberscroll.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    jobTitle: 'IT Security Professional',
    organization: 'CyberScroll Security',
    bio: 'Cybersecurity professional with expertise in threat intelligence, incident response, and security architecture.',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedData = userRegistrationSchema.parse(req.body);

    // Check if user already exists
    const existingUser = findUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Registration failed',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create new user
    const newUser = {
      id: uuidv4(),
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      jobTitle: validatedData.jobTitle || '',
      organization: validatedData.organization || '',
      bio: validatedData.bio || '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add user to database
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user data (without password) and token
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedData = userLoginSchema.parse(req.body);

    // Find user by email
    const user = findUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (without password) and token
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    const { password, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    // Validate request body
    const validatedData = passwordChangeSchema.parse(req.body);

    // Find user
    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Password change failed',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Generate new token
    const token = generateToken(user);

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

// @route   POST /api/auth/admin-login
// @desc    Authenticate admin with key
// @access  Public
router.post('/admin-login', async (req, res) => {
  try {
    const { adminKey } = req.body;

    if (!adminKey) {
      return res.status(400).json({
        error: 'Admin key required',
        message: 'Please provide an admin key'
      });
    }

    // Check if admin key matches
    const expectedAdminKey = process.env.ADMIN_KEY || 'cyberscroll-admin-2024';
    
    if (adminKey !== expectedAdminKey) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid admin key'
      });
    }

    // Find admin user
    const adminUser = users.find(user => user.role === 'admin');
    if (!adminUser) {
      return res.status(500).json({
        error: 'Admin user not found',
        message: 'Admin user is not configured'
      });
    }

    // Generate token
    const token = generateToken(adminUser);

    // Return admin data (without password) and token
    const { password, ...adminWithoutPassword } = adminUser;
    
    res.json({
      message: 'Admin login successful',
      user: adminWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      error: 'Admin login failed',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/verify-admin-key
// @desc    Verify admin key without login
// @access  Public
router.post('/verify-admin-key', async (req, res) => {
  try {
    const { adminKey } = req.body;

    if (!adminKey) {
      return res.status(400).json({
        error: 'Admin key required',
        message: 'Please provide an admin key'
      });
    }

    // Check if admin key matches
    const expectedAdminKey = process.env.ADMIN_KEY || 'cyberscroll-admin-2024';
    
    if (adminKey !== expectedAdminKey) {
      return res.status(401).json({
        error: 'Invalid admin key',
        message: 'The provided admin key is not valid'
      });
    }

    res.json({
      message: 'Admin key verified successfully',
      valid: true
    });

  } catch (error) {
    console.error('Admin key verification error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 