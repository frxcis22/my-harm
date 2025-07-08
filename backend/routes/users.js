const express = require('express');
const { z } = require('zod');
const { userUpdateSchema } = require('../validations/schemas');

const router = express.Router();

// Static admin user information
const ADMIN_USER = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Francis Bockarie',
  email: 'francis@cyberscroll.com',
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
};

// @route   GET /api/users/profile
// @desc    Get admin profile
// @access  Public
router.get('/profile', (req, res) => {
  try {
    res.json({
      user: ADMIN_USER
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update admin profile (read-only in public mode)
// @access  Public
router.put('/profile', (req, res) => {
  try {
    // In public mode, profile updates are not allowed
    res.status(403).json({
      error: 'Profile updates disabled',
      message: 'Profile updates are not available in public mode'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/preferences
// @desc    Get admin preferences
// @access  Public
router.get('/preferences', (req, res) => {
  try {
    res.json({
      preferences: ADMIN_USER.preferences
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get preferences',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update admin preferences (read-only in public mode)
// @access  Public
router.put('/preferences', (req, res) => {
  try {
    // In public mode, preference updates are not allowed
    res.status(403).json({
      error: 'Preference updates disabled',
      message: 'Preference updates are not available in public mode'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to update preferences',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 