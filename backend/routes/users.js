const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { userUpdateSchema, uuidSchema } = require('../validations/schemas');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Mock users database (in production, use a real database)
let users = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Francis Bockarie',
    email: 'francis@cyberscroll.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    jobTitle: 'IT Security Professional',
    organization: 'CyberScroll Security',
    bio: 'Cybersecurity professional with expertise in threat intelligence, incident response, and security architecture.',
    avatarUrl: null,
    role: 'admin',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      browserNotifications: false,
      defaultPostVisibility: 'private',
      analytics: true
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// Helper function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, (req, res) => {
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

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authenticateToken, (req, res) => {
  try {
    // Validate request body
    const validatedData = userUpdateSchema.parse(req.body);

    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Check if email is being changed and if it's already taken
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = findUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Profile update failed',
          message: 'Email is already in use'
        });
      }
    }

    // Update user profile
    Object.assign(user, validatedData);
    user.updatedAt = new Date();

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticateToken, (req, res) => {
  try {
    const { preferences } = req.body;

    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...preferences
    };
    user.updatedAt = new Date();

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Preferences updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', authenticateToken, (req, res) => {
  try {
    // In a real implementation, you would handle file upload here
    // For now, we'll just update the avatar URL
    const { avatarUrl } = req.body;

    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    user.avatarUrl = avatarUrl;
    user.updatedAt = new Date();

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Avatar updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      error: 'Failed to update avatar',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/export
// @desc    Export user data
// @access  Private
router.post('/export', authenticateToken, (req, res) => {
  try {
    const { format = 'json', includeDocuments = true, includeSettings = true } = req.body;

    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // In a real implementation, you would gather all user data here
    // For now, we'll return a mock export
    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        organization: user.organization,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      preferences: includeSettings ? user.preferences : null,
      // In a real implementation, you would include articles and documents here
      articles: [],
      documents: includeDocuments ? [] : null
    };

    res.json({
      message: 'Export started successfully',
      exportId: `export_${Date.now()}`,
      format,
      estimatedTime: '5-10 minutes'
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      error: 'Failed to export data',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/import
// @desc    Import user data
// @access  Private
router.post('/import', authenticateToken, (req, res) => {
  try {
    // In a real implementation, you would handle file upload and data import here
    const { importData } = req.body;

    res.json({
      message: 'Import completed successfully',
      importedItems: {
        articles: 0,
        documents: 0,
        settings: false
      }
    });

  } catch (error) {
    console.error('Import data error:', error);
    res.status(500).json({
      error: 'Failed to import data',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Account deletion failed',
        message: 'Password is required to delete account'
      });
    }

    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Account deletion failed',
        message: 'Invalid password'
      });
    }

    // In a real implementation, you would delete all user data here
    // For now, we'll just remove the user from the array
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private (admin)
router.get('/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const user = findUserById(id);
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
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (admin)
router.get('/', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let filteredUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    // Filter by search query
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.jobTitle.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 