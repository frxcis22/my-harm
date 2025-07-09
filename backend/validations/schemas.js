const Joi = require('joi');

// Article validation schema
const validateArticle = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(10).max(200).required(),
    excerpt: Joi.string().min(20).max(500).required(),
    content: Joi.string().min(100).required(),
    author: Joi.string().min(2).max(100).required(),
    tags: Joi.array().items(Joi.string().min(2).max(50)).max(10),
    publishedAt: Joi.date().iso(),
    likeCount: Joi.number().integer().min(0),
    commentCount: Joi.number().integer().min(0),
    viewCount: Joi.number().integer().min(0),
    isCurated: Joi.boolean(),
    isFeatured: Joi.boolean(),
    sourceUrl: Joi.string().uri().optional(),
    sourceName: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
    relevanceScore: Joi.number().min(0).max(100).optional()
  });

  return schema.validate(data);
};

// Comment validation schema
const validateComment = (data) => {
  const schema = Joi.object({
    author: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    content: Joi.string().min(10).max(1000).required()
  });

  return schema.validate(data);
};

// Search query validation schema
const validateSearchQuery = (data) => {
  const schema = Joi.object({
    query: Joi.string().min(2).max(200).required(),
    filters: Joi.object({
      dateRange: Joi.number().integer().min(1).max(365), // Days back
      tags: Joi.array().items(Joi.string()),
      source: Joi.string(),
      sortBy: Joi.string().valid('relevance', 'date', 'popularity'),
      sortOrder: Joi.string().valid('asc', 'desc')
    }).optional()
  });

  return schema.validate(data);
};

// Engagement tracking validation schema
const validateEngagement = (data) => {
  const schema = Joi.object({
    visitorId: Joi.string().required(),
    action: Joi.string().valid('like', 'share', 'comment', 'view').required(),
    platform: Joi.string().optional(), // For sharing
    metadata: Joi.object().optional() // Additional engagement data
  });

  return schema.validate(data);
};

// Featured article promotion validation
const validateFeaturedPromotion = (data) => {
  const schema = Joi.object({
    articleId: Joi.string().required(),
    reason: Joi.string().valid('high_engagement', 'editorial_choice', 'trending').required(),
    promotedBy: Joi.string().required(),
    notes: Joi.string().max(500).optional()
  });

  return schema.validate(data);
};

module.exports = {
  validateArticle,
  validateComment,
  validateSearchQuery,
  validateEngagement,
  validateFeaturedPromotion
}; 