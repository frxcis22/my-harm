const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const router = express.Router();

// Mock data for public access
let publicArticles = [
  {
    id: '1',
    title: 'Advanced Threat Detection Techniques',
    content: '# Advanced Threat Detection\n\nThis article covers modern threat detection methods...',
    excerpt: 'Learn about cutting-edge threat detection techniques used by security professionals.',
    author: 'Francis Bockarie',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['ThreatIntel', 'Detection'],
    status: 'published',
    viewCount: 1250,
    likeCount: 89,
    commentCount: 12
  },
  {
    id: '2',
    title: 'Vendor Risk Management Best Practices',
    content: '# Vendor Risk Management\n\nManaging third-party vendor risks is crucial...',
    excerpt: 'Essential strategies for managing vendor risks in enterprise environments.',
    author: 'Francis Bockarie',
    publishedAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['VendorRisk', 'Compliance'],
    status: 'published',
    viewCount: 890,
    likeCount: 67,
    commentCount: 8
  },
  {
    id: '3',
    title: 'Zero-Day Vulnerability Response',
    content: '# Zero-Day Vulnerability Response\n\nWhen zero-day vulnerabilities are discovered...',
    excerpt: 'How to respond effectively to zero-day vulnerabilities in your infrastructure.',
    author: 'Francis Bockarie',
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tags: ['ZeroDay', 'IncidentResponse'],
    status: 'published',
    viewCount: 2100,
    likeCount: 156,
    commentCount: 23
  }
];

let comments = [
  {
    id: '1',
    articleId: '1',
    author: 'SecurityPro',
    email: 'pro@example.com',
    content: 'Great article! The threat detection techniques you mentioned are spot on.',
    createdAt: new Date('2024-01-16'),
    status: 'approved'
  },
  {
    id: '2',
    articleId: '1',
    author: 'CyberAnalyst',
    email: 'analyst@example.com',
    content: 'Very informative. Would love to see more content on this topic.',
    createdAt: new Date('2024-01-17'),
    status: 'approved'
  }
];

let likes = [
  { articleId: '1', visitorId: 'visitor1' },
  { articleId: '1', visitorId: 'visitor2' },
  { articleId: '2', visitorId: 'visitor1' }
];

let messages = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about threat detection',
    message: 'Hi Francis, I have a question about the threat detection techniques...',
    createdAt: new Date('2024-01-18'),
    status: 'unread'
  }
];

// Helper functions
const findArticleById = (id) => {
  return publicArticles.find(article => article.id === id && article.status === 'published');
};

const findCommentsByArticleId = (articleId) => {
  return comments.filter(comment => comment.articleId === articleId && comment.status === 'approved');
};

const getLikesCount = (articleId) => {
  return likes.filter(like => like.articleId === articleId).length;
};

const hasVisitorLiked = (articleId, visitorId) => {
  return likes.some(like => like.articleId === articleId && like.visitorId === visitorId);
};

// @route   GET /api/public/articles
// @desc    Get all published articles
// @access  Public
router.get('/articles', (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let filteredArticles = publicArticles.filter(article => article.status === 'published');

    // Filter by category/tag
    if (category) {
      filteredArticles = filteredArticles.filter(article =>
        article.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
      );
    }

    // Filter by search query
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by published date (newest first)
    filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Pagination
    const total = filteredArticles.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    res.json({
      articles: paginatedArticles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get public articles error:', error);
    res.status(500).json({
      error: 'Failed to get articles',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/public/articles/:id
// @desc    Get single published article
// @access  Public
router.get('/articles/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    // Increment view count
    article.viewCount += 1;

    res.json({
      article
    });

  } catch (error) {
    console.error('Get public article error:', error);
    res.status(500).json({
      error: 'Failed to get article',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/public/articles/:id/comments
// @desc    Get article comments
// @access  Public
router.get('/articles/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    
    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    const articleComments = findCommentsByArticleId(id);

    res.json({
      comments: articleComments
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      error: 'Failed to get comments',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/public/articles/:id/comments
// @desc    Add comment to article
// @access  Public
router.post('/articles/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { author, email, content } = req.body;

    // Validate input
    if (!author || !email || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Author, email, and content are required'
      });
    }

    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    // Create new comment
    const newComment = {
      id: uuidv4(),
      articleId: id,
      author: author.trim(),
      email: email.trim(),
      content: content.trim(),
      createdAt: new Date(),
      status: 'pending' // Requires admin approval
    };

    comments.push(newComment);

    // Increment comment count
    article.commentCount += 1;

    res.status(201).json({
      message: 'Comment submitted successfully. It will be visible after approval.',
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/public/articles/:id/like
// @desc    Like/unlike article
// @access  Public
router.post('/articles/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        error: 'Visitor ID required',
        message: 'Visitor ID is required to like/unlike articles'
      });
    }

    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    const existingLike = likes.find(like => 
      like.articleId === id && like.visitorId === visitorId
    );

    if (existingLike) {
      // Unlike
      const likeIndex = likes.findIndex(like => 
        like.articleId === id && like.visitorId === visitorId
      );
      likes.splice(likeIndex, 1);
      article.likeCount = Math.max(0, article.likeCount - 1);

      res.json({
        message: 'Article unliked',
        liked: false,
        likeCount: article.likeCount
      });
    } else {
      // Like
      likes.push({ articleId: id, visitorId });
      article.likeCount += 1;

      res.json({
        message: 'Article liked',
        liked: true,
        likeCount: article.likeCount
      });
    }

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      error: 'Failed to toggle like',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/public/articles/:id/likes
// @desc    Get article likes count
// @access  Public
router.get('/articles/:id/likes', (req, res) => {
  try {
    const { id } = req.params;
    
    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    const likeCount = getLikesCount(id);

    res.json({
      likeCount
    });

  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({
      error: 'Failed to get likes',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/public/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', (req, res) => {
  try {
    const categories = [
      { name: 'ThreatIntel', count: 8 },
      { name: 'VendorRisk', count: 5 },
      { name: 'Detection', count: 6 },
      { name: 'Compliance', count: 4 },
      { name: 'ZeroDay', count: 3 },
      { name: 'IncidentResponse', count: 4 },
      { name: 'CloudSec', count: 3 },
      { name: 'PenTesting', count: 2 }
    ];

    res.json({
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/public/search
// @desc    Search articles
// @access  Public
router.get('/search', (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Search term is required'
      });
    }

    const searchTerm = q.toLowerCase();
    const searchResults = publicArticles.filter(article => 
      article.status === 'published' && (
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    );

    // Sort by relevance (simple implementation)
    searchResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    // Pagination
    const total = searchResults.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    res.json({
      results: paginatedResults,
      query: q,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/public/stats
// @desc    Get blog statistics
// @access  Public
router.get('/stats', (req, res) => {
  try {
    const publishedArticles = publicArticles.filter(article => article.status === 'published');
    const totalViews = publishedArticles.reduce((sum, article) => sum + article.viewCount, 0);
    const totalLikes = publishedArticles.reduce((sum, article) => sum + article.likeCount, 0);
    const totalComments = publishedArticles.reduce((sum, article) => sum + article.commentCount, 0);

    const stats = {
      totalArticles: publishedArticles.length,
      totalViews,
      totalLikes,
      totalComments,
      averageViews: publishedArticles.length > 0 ? Math.round(totalViews / publishedArticles.length) : 0,
      mostViewed: publishedArticles.length > 0 
        ? publishedArticles.reduce((max, article) => article.viewCount > max.viewCount ? article : max)
        : null
    };

    res.json({
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/public/contact
// @desc    Send contact message
// @access  Public
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, subject, and message are required'
      });
    }

    // Create new message
    const newMessage = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date(),
      status: 'unread'
    };

    messages.push(newMessage);

    res.status(201).json({
      message: 'Message sent successfully. I will get back to you soon!',
      messageId: newMessage.id
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 