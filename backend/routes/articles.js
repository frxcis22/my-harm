const express = require('express');
const router = express.Router();
const { validateArticle, validateComment } = require('../validations/schemas');

// In-memory storage for demo (in production, use a database)
let articles = [
  {
    id: 1,
    title: "Advanced Phishing Detection Techniques",
    excerpt: "Exploring the latest methods to identify and prevent sophisticated phishing attacks that target organizations worldwide.",
    content: "Full article content here...",
    author: "Francis Bockarie",
    tags: ["ThreatIntel", "Detection"],
    publishedAt: "2024-01-15T10:00:00Z",
    likeCount: 89,
    commentCount: 12,
    viewCount: 1247,
    isCurated: false,
    isFeatured: true
  },
  {
    id: 2,
    title: "Vendor Risk Assessment Framework",
    excerpt: "A comprehensive guide to evaluating third-party security risks and implementing effective vendor management strategies.",
    content: "Full article content here...",
    author: "Francis Bockarie",
    tags: ["VendorRisk", "Compliance"],
    publishedAt: "2024-01-12T14:30:00Z",
    likeCount: 67,
    commentCount: 8,
    viewCount: 892,
    isCurated: false,
    isFeatured: true
  }
];

let curatedArticles = [];
let comments = [];
let engagementData = new Map(); // Track article engagement

// Get all articles
router.get('/', async (req, res) => {
  try {
    res.json({ 
      articles: articles,
      total: articles.length 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get featured articles (original + popular curated)
router.get('/featured', async (req, res) => {
  try {
    // Get original featured articles
    const originalFeatured = articles.filter(article => article.isFeatured);
    
    // Get popular curated articles (high engagement)
    const popularCurated = curatedArticles
      .filter(article => {
        const engagement = engagementData.get(article.id) || { likes: 0, comments: 0, shares: 0 };
        const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
        return totalEngagement >= 10; // Threshold for "popular"
      })
      .sort((a, b) => {
        const engagementA = engagementData.get(a.id) || { likes: 0, comments: 0, shares: 0 };
        const engagementB = engagementData.get(b.id) || { likes: 0, comments: 0, shares: 0 };
        const totalA = engagementA.likes + engagementA.comments + engagementA.shares;
        const totalB = engagementB.likes + engagementB.comments + engagementB.shares;
        return totalB - totalA;
      })
      .slice(0, 6); // Top 6 curated articles
    
    const featuredArticles = [...originalFeatured, ...popularCurated];
    
    res.json({ 
      articles: featuredArticles,
      total: featuredArticles.length 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

// Search for real-time articles
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Call the article aggregator service
    const ArticleAggregator = require('../../src/services/articleAggregator');
    const searchResults = await ArticleAggregator.searchRealTimeArticles(query, filters);
    
    // Store curated articles for engagement tracking
    searchResults.forEach(article => {
      if (!curatedArticles.find(existing => existing.id === article.id)) {
        curatedArticles.push(article);
        engagementData.set(article.id, { likes: 0, comments: 0, shares: 0 });
      }
    });

    res.json({ 
      articles: searchResults,
      total: searchResults.length,
      query: query
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

// Get curated articles
router.get('/curated', async (req, res) => {
  try {
    res.json({ 
      articles: curatedArticles,
      total: curatedArticles.length 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch curated articles' });
  }
});

// Like an article (works for both original and curated)
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.body;
    
    // Check if it's an original article
    const originalArticle = articles.find(article => article.id.toString() === id);
    if (originalArticle) {
      originalArticle.likeCount += 1;
      return res.json({ likeCount: originalArticle.likeCount });
    }
    
    // Check if it's a curated article
    const curatedArticle = curatedArticles.find(article => article.id === id);
    if (curatedArticle) {
      const engagement = engagementData.get(id) || { likes: 0, comments: 0, shares: 0 };
      engagement.likes += 1;
      engagementData.set(id, engagement);
      
      // Update the article's like count
      curatedArticle.likeCount = engagement.likes;
      
      // Check if article should be promoted to featured
      const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
      if (totalEngagement >= 20 && !curatedArticle.isFeatured) {
        curatedArticle.isFeatured = true;
      }
      
      return res.json({ likeCount: engagement.likes });
    }
    
    res.status(404).json({ error: 'Article not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like article' });
  }
});

// Share an article
router.post('/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, visitorId } = req.body;
    
    // Track share for curated articles
    const curatedArticle = curatedArticles.find(article => article.id === id);
    if (curatedArticle) {
      const engagement = engagementData.get(id) || { likes: 0, comments: 0, shares: 0 };
      engagement.shares += 1;
      engagementData.set(id, engagement);
      
      // Update the article's share count
      curatedArticle.shareCount = (curatedArticle.shareCount || 0) + 1;
      
      // Check if article should be promoted to featured
      const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
      if (totalEngagement >= 20 && !curatedArticle.isFeatured) {
        curatedArticle.isFeatured = true;
      }
    }
    
    res.json({ success: true, message: 'Article shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share article' });
  }
});

// Get article engagement data
router.get('/:id/engagement', async (req, res) => {
  try {
    const { id } = req.params;
    
    const engagement = engagementData.get(id) || { likes: 0, comments: 0, shares: 0 };
    res.json({ engagement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch engagement data' });
  }
});

// Get comments for an article
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const articleComments = comments.filter(comment => comment.articleId.toString() === id);
    res.json({ comments: articleComments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add a comment to an article
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, email, content } = req.body;
    
    // Validate comment data
    const { error } = validateComment({ author, email, content });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const newComment = {
      id: comments.length + 1,
      articleId: parseInt(id),
      author,
      email,
      content,
      createdAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    
    // Update article comment count
    const originalArticle = articles.find(article => article.id.toString() === id);
    if (originalArticle) {
      originalArticle.commentCount += 1;
    }
    
    // Track comment for curated articles
    const curatedArticle = curatedArticles.find(article => article.id === id);
    if (curatedArticle) {
      const engagement = engagementData.get(id) || { likes: 0, comments: 0, shares: 0 };
      engagement.comments += 1;
      engagementData.set(id, engagement);
      
      // Update the article's comment count
      curatedArticle.commentCount = engagement.comments;
      
      // Check if article should be promoted to featured
      const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
      if (totalEngagement >= 20 && !curatedArticle.isFeatured) {
        curatedArticle.isFeatured = true;
      }
    }
    
    res.status(201).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get a specific article
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check original articles first
    const originalArticle = articles.find(article => article.id.toString() === id);
    if (originalArticle) {
      return res.json({ article: originalArticle });
    }
    
    // Check curated articles
    const curatedArticle = curatedArticles.find(article => article.id === id);
    if (curatedArticle) {
      return res.json({ article: curatedArticle });
    }
    
    res.status(404).json({ error: 'Article not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create a new article (admin only)
router.post('/', async (req, res) => {
  try {
    const { error } = validateArticle(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const newArticle = {
      id: articles.length + 1,
      ...req.body,
      publishedAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      isCurated: false,
      isFeatured: false
    };
    
    articles.push(newArticle);
    res.status(201).json({ article: newArticle });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update an article (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validateArticle(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const articleIndex = articles.findIndex(article => article.id.toString() === id);
    if (articleIndex === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    articles[articleIndex] = { ...articles[articleIndex], ...req.body };
    res.json({ article: articles[articleIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete an article (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articleIndex = articles.findIndex(article => article.id.toString() === id);
    
    if (articleIndex === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    articles.splice(articleIndex, 1);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router; 