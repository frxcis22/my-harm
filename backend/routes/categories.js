const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { 
  categoryCreateSchema, 
  categoryUpdateSchema, 
  uuidSchema 
} = require('../validations/schemas');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Mock categories database (in production, use a real database)
let categories = [
  {
    id: '1',
    name: 'ThreatIntel',
    description: 'Threat intelligence and analysis',
    color: '#ef4444',
    usageCount: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'VendorRisk',
    description: 'Third-party vendor risk management',
    color: '#3b82f6',
    usageCount: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Detection',
    description: 'Security detection and monitoring',
    color: '#10b981',
    usageCount: 6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    name: 'Compliance',
    description: 'Regulatory compliance and governance',
    color: '#f59e0b',
    usageCount: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '5',
    name: 'ZeroDay',
    description: 'Zero-day vulnerability research',
    color: '#8b5cf6',
    usageCount: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '6',
    name: 'IncidentResponse',
    description: 'Security incident response procedures',
    color: '#ec4899',
    usageCount: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '7',
    name: 'CloudSec',
    description: 'Cloud security best practices',
    color: '#06b6d4',
    usageCount: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: 'PenTesting',
    description: 'Penetration testing methodologies',
    color: '#84cc16',
    usageCount: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2023-12-28')
  }
];

// Helper function to find category by ID
const findCategoryById = (id) => {
  return categories.find(category => category.id === id);
};

// Helper function to find category by name
const findCategoryByName = (name) => {
  return categories.find(category => category.name.toLowerCase() === name.toLowerCase());
};

// Helper function to update category usage count
const updateCategoryUsage = (categoryName, increment = true) => {
  const category = findCategoryByName(categoryName);
  if (category) {
    category.usageCount = increment ? category.usageCount + 1 : Math.max(0, category.usageCount - 1);
    category.updatedAt = new Date();
  }
};

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, sortBy = 'usageCount', sortOrder = 'desc' } = req.query;
    
    let filteredCategories = [...categories];

    // Filter by search query
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCategories = filteredCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort categories
    filteredCategories.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    res.json({
      categories: filteredCategories,
      total: filteredCategories.length
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Private
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const category = findCategoryById(id);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'Category does not exist'
      });
    }

    res.json({
      category
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Failed to get category',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
router.post('/', authenticateToken, (req, res) => {
  try {
    // Validate request body
    const validatedData = categoryCreateSchema.parse(req.body);

    // Check if category already exists
    const existingCategory = findCategoryByName(validatedData.name);
    if (existingCategory) {
      return res.status(400).json({
        error: 'Category creation failed',
        message: 'Category with this name already exists'
      });
    }

    // Create new category
    const newCategory = {
      id: uuidv4(),
      name: validatedData.name,
      description: validatedData.description || '',
      color: validatedData.color || '#3b82f6',
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add category to database
    categories.push(newCategory);

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Create category error:', error);
    res.status(500).json({
      error: 'Failed to create category',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', authenticateToken, (req, res) => {
  try {
    // Validate category ID
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    // Validate request body
    const validatedData = categoryUpdateSchema.parse(req.body);

    // Find category
    const category = findCategoryById(id);
    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'Category does not exist'
      });
    }

    // Check if new name conflicts with existing category
    if (validatedData.name && validatedData.name !== category.name) {
      const existingCategory = findCategoryByName(validatedData.name);
      if (existingCategory) {
        return res.status(400).json({
          error: 'Category update failed',
          message: 'Category with this name already exists'
        });
      }
    }

    // Update category
    Object.assign(category, validatedData);
    category.updatedAt = new Date();

    res.json({
      message: 'Category updated successfully',
      category
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Update category error:', error);
    res.status(500).json({
      error: 'Failed to update category',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    // Validate category ID
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    // Find category
    const categoryIndex = categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'Category does not exist'
      });
    }

    const category = categories[categoryIndex];

    // Check if category is in use
    if (category.usageCount > 0) {
      return res.status(400).json({
        error: 'Category deletion failed',
        message: 'Cannot delete category that is currently in use'
      });
    }

    // Remove category
    categories.splice(categoryIndex, 1);

    res.json({
      message: 'Category deleted successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/categories/stats/overview
// @desc    Get category statistics
// @access  Private
router.get('/stats/overview', authenticateToken, (req, res) => {
  try {
    const stats = {
      total: categories.length,
      totalUsage: categories.reduce((sum, cat) => sum + cat.usageCount, 0),
      averageUsage: categories.length > 0 
        ? Math.round(categories.reduce((sum, cat) => sum + cat.usageCount, 0) / categories.length)
        : 0,
      mostUsed: categories.length > 0 
        ? categories.reduce((max, cat) => cat.usageCount > max.usageCount ? cat : max)
        : null,
      recentlyUpdated: categories
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
    };

    res.json({
      stats
    });

  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      error: 'Failed to get category statistics',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/categories/merge
// @desc    Merge two categories
// @access  Private
router.post('/merge', authenticateToken, (req, res) => {
  try {
    const { sourceId, targetId } = req.body;

    if (!sourceId || !targetId) {
      return res.status(400).json({
        error: 'Merge failed',
        message: 'Source and target category IDs are required'
      });
    }

    const sourceCategory = findCategoryById(sourceId);
    const targetCategory = findCategoryById(targetId);

    if (!sourceCategory || !targetCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'One or both categories do not exist'
      });
    }

    if (sourceId === targetId) {
      return res.status(400).json({
        error: 'Merge failed',
        message: 'Cannot merge a category with itself'
      });
    }

    // Update target category usage count
    targetCategory.usageCount += sourceCategory.usageCount;
    targetCategory.updatedAt = new Date();

    // Remove source category
    const sourceIndex = categories.findIndex(cat => cat.id === sourceId);
    categories.splice(sourceIndex, 1);

    res.json({
      message: 'Categories merged successfully',
      targetCategory
    });

  } catch (error) {
    console.error('Merge categories error:', error);
    res.status(500).json({
      error: 'Failed to merge categories',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/categories/popular
// @desc    Get most popular categories
// @access  Private
router.get('/popular', authenticateToken, (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularCategories = categories
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, parseInt(limit));

    res.json({
      categories: popularCategories
    });

  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({
      error: 'Failed to get popular categories',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 