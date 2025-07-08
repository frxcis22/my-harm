const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const { 
  articleCreateSchema, 
  articleUpdateSchema, 
  articleQuerySchema,
  uuidSchema 
} = require('../validations/schemas');

const router = express.Router();

// Mock articles database (in production, use a real database)
let articles = [
  {
    id: '1',
    authorId: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Advanced Phishing Detection Techniques',
    content: '# Advanced Phishing Detection Techniques\n\n## Introduction\n\nPhishing attacks continue to evolve...',
    excerpt: 'Exploring the latest methods to identify and prevent sophisticated phishing attacks that target enterprise environments.',
    tags: ['ThreatIntel', 'Detection'],
    visibility: 'public',
    status: 'published',
    views: 1247,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    authorId: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Vendor Risk Assessment Framework',
    content: '# Vendor Risk Assessment Framework\n\n## Overview\n\nA comprehensive guide...',
    excerpt: 'A comprehensive guide to evaluating third-party security risks and implementing effective vendor management strategies.',
    tags: ['VendorRisk', 'Compliance'],
    visibility: 'public',
    status: 'published',
    views: 892,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    authorId: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Zero-Day Exploit Analysis',
    content: '# Zero-Day Exploit Analysis\n\n## Deep Dive\n\nRecent zero-day vulnerabilities...',
    excerpt: 'Deep dive into recent zero-day vulnerabilities and mitigation strategies for critical infrastructure protection.',
    tags: ['ZeroDay', 'Analysis'],
    visibility: 'public',
    status: 'published',
    views: 2156,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

// Helper function to find article by ID
const findArticleById = (id) => {
  return articles.find(article => article.id === id);
};

// Helper function to get articles by author
const getArticlesByAuthor = (authorId) => {
  return articles.filter(article => article.authorId === authorId);
};

// Helper function to increment article views
const incrementViews = (articleId) => {
  const article = findArticleById(articleId);
  if (article) {
    article.views = (article.views || 0) + 1;
  }
};

// @route   GET /api/articles
// @desc    Get all articles with filtering and pagination
// @access  Public
router.get('/', (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = articleQuerySchema.parse(req.query);
    
    let filteredArticles = [...articles];

    // Filter by search query
    if (validatedQuery.search) {
      const searchTerm = validatedQuery.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by tags
    if (validatedQuery.tags) {
      const tagArray = validatedQuery.tags.split(',').map(tag => tag.trim());
      filteredArticles = filteredArticles.filter(article =>
        tagArray.some(tag => article.tags.includes(tag))
      );
    }

    // Filter by status
    if (validatedQuery.status && validatedQuery.status !== 'all') {
      filteredArticles = filteredArticles.filter(article => 
        article.status === validatedQuery.status
      );
    }

    // Show all articles (no visibility restrictions)
    filteredArticles = filteredArticles.filter(article => article.visibility === 'public');

    // Sort articles
    filteredArticles.sort((a, b) => {
      const aValue = a[validatedQuery.sortBy];
      const bValue = b[validatedQuery.sortBy];
      
      if (validatedQuery.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const total = filteredArticles.length;
    const startIndex = (validatedQuery.page - 1) * validatedQuery.limit;
    const endIndex = startIndex + validatedQuery.limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    res.json({
      articles: paginatedArticles,
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total,
        pages: Math.ceil(total / validatedQuery.limit)
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Get articles error:', error);
    res.status(500).json({
      error: 'Failed to get articles',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Get article by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    // Validate article ID
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist'
      });
    }

    // Increment views for all articles
    incrementViews(id);

    res.json({
      article
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Get article error:', error);
    res.status(500).json({
      error: 'Failed to get article',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/articles
// @desc    Create a new article
// @access  Public
router.post('/', (req, res) => {
  try {
    // Validate request body
    const validatedData = articleCreateSchema.parse(req.body);

    // Create new article
    const newArticle = {
      id: uuidv4(),
      authorId: '550e8400-e29b-41d4-a716-446655440000', // Default author ID
      title: validatedData.title,
      content: validatedData.content,
      excerpt: validatedData.excerpt || '',
      tags: validatedData.tags || [],
      visibility: validatedData.visibility,
      status: validatedData.status,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add article to database
    articles.push(newArticle);

    res.status(201).json({
      message: 'Article created successfully',
      article: newArticle
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Create article error:', error);
    res.status(500).json({
      error: 'Failed to create article',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update an article
// @access  Public
router.put('/:id', (req, res) => {
  try {
    // Validate article ID
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    // Validate request body
    const validatedData = articleUpdateSchema.parse(req.body);

    // Find article
    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist'
      });
    }

    // Update article
    Object.assign(article, validatedData);
    article.updatedAt = new Date();

    res.json({
      message: 'Article updated successfully',
      article
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Update article error:', error);
    res.status(500).json({
      error: 'Failed to update article',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Delete an article
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    // Validate article ID
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    // Find article
    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist'
      });
    }

    // Remove article from database
    const articleIndex = articles.findIndex(a => a.id === id);
    if (articleIndex !== -1) {
      articles.splice(articleIndex, 1);
    }

    res.json({
      message: 'Article deleted successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Delete article error:', error);
    res.status(500).json({
      error: 'Failed to delete article',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/articles/stats/overview
// @desc    Get article statistics
// @access  Public
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      total: articles.length,
      published: articles.filter(article => article.status === 'published').length,
      drafts: articles.filter(article => article.status === 'draft').length,
      public: articles.filter(article => article.visibility === 'public').length,
      private: articles.filter(article => article.visibility === 'private').length,
      totalViews: articles.reduce((sum, article) => sum + (article.views || 0), 0),
      averageViews: articles.length > 0 
        ? Math.round(articles.reduce((sum, article) => sum + (article.views || 0), 0) / articles.length)
        : 0
    };

    res.json({
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get stats',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 