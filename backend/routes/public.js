const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { z } = require('zod');
const nodemailer = require('nodemailer');
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

// Email transporter configuration
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('⚠️  Email credentials not configured. Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

const transporter = createTransporter();

// Notification functions
const sendNotificationEmail = async (type, data) => {
  if (!transporter) {
    console.log(`📧 [MOCK] ${type} notification:`, data);
    return true;
  }

  let subject, html;
  
  switch (type) {
    case 'comment':
      subject = `New Comment on "${data.articleTitle}"`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">CyberScroll Security</h2>
          <h3>New Comment Received</h3>
          <p><strong>Article:</strong> ${data.articleTitle}</p>
          <p><strong>Commenter:</strong> ${data.author} (${data.email})</p>
          <p><strong>Comment:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0;">
            ${data.content}
          </div>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated notification from CyberScroll Security.</p>
        </div>
      `;
      break;
      
    case 'like':
      subject = `New Like on "${data.articleTitle}"`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">CyberScroll Security</h2>
          <h3>New Like Received</h3>
          <p><strong>Article:</strong> ${data.articleTitle}</p>
          <p><strong>Visitor ID:</strong> ${data.visitorId}</p>
          <p><strong>Total Likes:</strong> ${data.totalLikes}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated notification from CyberScroll Security.</p>
        </div>
      `;
      break;
      
    case 'share':
      subject = `Content Shared: "${data.articleTitle}"`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">CyberScroll Security</h2>
          <h3>Content Shared</h3>
          <p><strong>Article:</strong> ${data.articleTitle}</p>
          <p><strong>Platform:</strong> ${data.platform}</p>
          <p><strong>Shared by:</strong> ${data.visitorId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated notification from CyberScroll Security.</p>
        </div>
      `;
      break;
      
    case 'contact':
      subject = `New Contact Message: ${data.subject}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">CyberScroll Security</h2>
          <h3>New Contact Message</h3>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0;">
            ${data.message}
          </div>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated notification from CyberScroll Security.</p>
        </div>
      `;
      break;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to admin
    subject: subject,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 ${type} notification sent to admin`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send ${type} notification:`, error.message);
    return false;
  }
};

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
      author,
      email,
      content,
      createdAt: new Date(),
      status: 'approved' // Auto-approve in public mode
    };

    // Add comment to database
    comments.push(newComment);

    // Update article comment count
    article.commentCount = findCommentsByArticleId(id).length;

    // Send notification email
    sendNotificationEmail('comment', {
      articleTitle: article.title,
      author,
      email,
      content
    });

    res.status(201).json({
      message: 'Comment added successfully',
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
        error: 'Missing visitor ID',
        message: 'Visitor ID is required'
      });
    }

    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    const hasLiked = hasVisitorLiked(id, visitorId);
    let action;

    if (hasLiked) {
      // Unlike
      const likeIndex = likes.findIndex(like => 
        like.articleId === id && like.visitorId === visitorId
      );
      if (likeIndex !== -1) {
        likes.splice(likeIndex, 1);
      }
      action = 'unliked';
    } else {
      // Like
      likes.push({ articleId: id, visitorId });
      action = 'liked';
      
      // Send notification email for new likes
      sendNotificationEmail('like', {
        articleTitle: article.title,
        visitorId,
        totalLikes: getLikesCount(id) + 1
      });
    }

    // Update article like count
    article.likeCount = getLikesCount(id);

    res.json({
      message: `Article ${action} successfully`,
      liked: !hasLiked,
      likeCount: article.likeCount
    });

  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({
      error: 'Failed to like article',
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/public/articles/:id/share
// @desc    Share article
// @access  Public
router.post('/articles/:id/share', (req, res) => {
  try {
    const { id } = req.params;
    const { platform, visitorId } = req.body;

    if (!platform || !visitorId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Platform and visitor ID are required'
      });
    }

    const article = findArticleById(id);
    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
        message: 'Article does not exist or is not published'
      });
    }

    // Send notification email
    sendNotificationEmail('share', {
      articleTitle: article.title,
      platform,
      visitorId
    });

    res.json({
      message: 'Article shared successfully',
      platform,
      articleTitle: article.title
    });

  } catch (error) {
    console.error('Share article error:', error);
    res.status(500).json({
      error: 'Failed to share article',
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

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, subject, and message are required'
      });
    }

    // Create new message
    const newMessage = {
      id: uuidv4(),
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      status: 'unread'
    };

    // Add message to database
    messages.push(newMessage);

    // Send notification email
    sendNotificationEmail('contact', {
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      message: 'Message sent successfully',
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