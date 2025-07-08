# API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Public Endpoints](#public-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Security](#security)

## Overview

The Cybersecurity Blog API provides endpoints for managing blog content, user interactions, and administrative functions. The API is built with Node.js, Express, and MongoDB.

### Base URL
```
Development: http://localhost:5000
Production: https://api.cyberscroll.com
```

### Content Types
- **Request**: `application/json`
- **Response**: `application/json`

## Authentication

### Admin Authentication
Admin endpoints require multi-factor authentication:

```javascript
// Admin credentials
{
  "email": "francis@cyberscroll.com",
  "password": "CyberScroll2024!",
  "pin": "1337"
}
```

### JWT Token
After successful authentication, a JWT token is returned:

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Francis Bockarie",
    "email": "francis@cyberscroll.com",
    "role": "admin"
  }
}
```

### Authorization Header
Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Public Endpoints

### Get All Published Articles
```http
GET /api/public/articles
```

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Articles per page (default: 10)
- `search` (string): Search term for article content
- `tag` (string): Filter by tag
- `sort` (string): Sort order (newest, oldest, popular)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-id",
        "title": "Advanced Threat Detection",
        "excerpt": "Exploring the latest methods...",
        "content": "Full article content...",
        "author": {
          "name": "Francis Bockarie",
          "email": "francis@cyberscroll.com"
        },
        "tags": ["ThreatIntel", "Detection"],
        "publishedAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "stats": {
          "views": 1247,
          "likes": 89,
          "comments": 12,
          "shares": 5
        },
        "status": "published"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "pages": 3
    }
  }
}
```

### Get Single Article
```http
GET /api/public/articles/:id
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "article": {
      "id": "article-id",
      "title": "Advanced Threat Detection",
      "excerpt": "Exploring the latest methods...",
      "content": "Full article content...",
      "author": {
        "name": "Francis Bockarie",
        "email": "francis@cyberscroll.com"
      },
      "tags": ["ThreatIntel", "Detection"],
      "publishedAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "stats": {
        "views": 1247,
        "likes": 89,
        "comments": 12,
        "shares": 5
      },
      "status": "published",
      "comments": [
        {
          "id": "comment-id",
          "content": "Great article!",
          "author": "John Doe",
          "email": "john@example.com",
          "createdAt": "2024-01-15T11:00:00Z"
        }
      ]
    }
  }
}
```

### Add Comment
```http
POST /api/public/articles/:id/comments
```

**Request Body:**
```javascript
{
  "content": "Great article! Very informative.",
  "author": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment-id",
      "content": "Great article! Very informative.",
      "author": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Comment added successfully"
}
```

### Like Article
```http
POST /api/public/articles/:id/like
```

**Request Body:**
```javascript
{
  "email": "john@example.com"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "likes": 90
  },
  "message": "Article liked successfully"
}
```

### Share Article
```http
POST /api/public/articles/:id/share
```

**Request Body:**
```javascript
{
  "platform": "twitter", // twitter, facebook, linkedin, email
  "email": "john@example.com"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "shares": 6
  },
  "message": "Article shared successfully"
}
```

### Send Contact Message
```http
POST /api/public/contact
```

**Request Body:**
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about cybersecurity",
  "message": "I have a question about..."
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Message sent successfully"
}
```

## Admin Endpoints

### Admin Authentication
```http
POST /api/admin/auth/login
```

**Request Body:**
```javascript
{
  "email": "francis@cyberscroll.com",
  "password": "CyberScroll2024!",
  "pin": "1337"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Francis Bockarie",
      "email": "francis@cyberscroll.com",
      "role": "admin"
    },
    "sessionExpiry": "2024-01-15T12:30:00Z"
  }
}
```

### Get All Articles (Admin)
```http
GET /api/admin/articles
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Articles per page
- `status` (string): Filter by status (draft, published, archived)
- `search` (string): Search term

**Response:**
```javascript
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-id",
        "title": "Advanced Threat Detection",
        "excerpt": "Exploring the latest methods...",
        "content": "Full article content...",
        "author": {
          "name": "Francis Bockarie",
          "email": "francis@cyberscroll.com"
        },
        "tags": ["ThreatIntel", "Detection"],
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "publishedAt": "2024-01-15T10:00:00Z",
        "stats": {
          "views": 1247,
          "likes": 89,
          "comments": 12,
          "shares": 5
        },
        "status": "published"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "pages": 3
    }
  }
}
```

### Create Article
```http
POST /api/admin/articles
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```javascript
{
  "title": "New Article Title",
  "excerpt": "Article excerpt...",
  "content": "Full article content...",
  "tags": ["Security", "Analysis"],
  "status": "draft" // draft, published, archived
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "article": {
      "id": "new-article-id",
      "title": "New Article Title",
      "excerpt": "Article excerpt...",
      "content": "Full article content...",
      "author": {
        "name": "Francis Bockarie",
        "email": "francis@cyberscroll.com"
      },
      "tags": ["Security", "Analysis"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "status": "draft"
    }
  },
  "message": "Article created successfully"
}
```

### Update Article
```http
PUT /api/admin/articles/:id
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```javascript
{
  "title": "Updated Article Title",
  "excerpt": "Updated excerpt...",
  "content": "Updated content...",
  "tags": ["Security", "Analysis", "Updated"],
  "status": "published"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "article": {
      "id": "article-id",
      "title": "Updated Article Title",
      "excerpt": "Updated excerpt...",
      "content": "Updated content...",
      "author": {
        "name": "Francis Bockarie",
        "email": "francis@cyberscroll.com"
      },
      "tags": ["Security", "Analysis", "Updated"],
      "updatedAt": "2024-01-15T11:00:00Z",
      "status": "published"
    }
  },
  "message": "Article updated successfully"
}
```

### Delete Article
```http
DELETE /api/admin/articles/:id
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```javascript
{
  "success": true,
  "message": "Article deleted successfully"
}
```

### Get Article Statistics
```http
GET /api/admin/articles/stats/overview
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "totalArticles": 24,
    "publishedArticles": 20,
    "draftArticles": 3,
    "archivedArticles": 1,
    "totalViews": 15200,
    "totalLikes": 1200,
    "totalComments": 156,
    "totalShares": 89,
    "topTags": [
      { "tag": "ThreatIntel", "count": 8 },
      { "tag": "Detection", "count": 6 },
      { "tag": "Security", "count": 5 }
    ],
    "recentActivity": [
      {
        "type": "comment",
        "article": "Advanced Threat Detection",
        "user": "john@example.com",
        "timestamp": "2024-01-15T11:00:00Z"
      }
    ]
  }
}
```

### Get Admin Profile
```http
GET /api/admin/profile
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Francis Bockarie",
      "email": "francis@cyberscroll.com",
      "jobTitle": "IT Security Professional",
      "organization": "CyberScroll Security",
      "bio": "Cybersecurity professional with expertise...",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

### Update Admin Profile
```http
PUT /api/admin/profile
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```javascript
{
  "name": "Francis Bockarie",
  "jobTitle": "Senior IT Security Professional",
  "organization": "CyberScroll Security",
  "bio": "Updated bio..."
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Francis Bockarie",
      "email": "francis@cyberscroll.com",
      "jobTitle": "Senior IT Security Professional",
      "organization": "CyberScroll Security",
      "bio": "Updated bio...",
      "role": "admin",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Profile updated successfully"
}
```

### Get Admin Access Logs
```http
GET /api/admin/logs/access
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Logs per page
- `type` (string): Filter by type (success, failed, lockout, logout)
- `startDate` (string): Start date filter
- `endDate` (string): End date filter

**Response:**
```javascript
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-id",
        "timestamp": "2024-01-15T10:00:00Z",
        "type": "success",
        "details": "Admin access granted for francis@cyberscroll.com",
        "ip": "127.0.0.1",
        "userAgent": "Mozilla/5.0...",
        "userId": "550e8400-e29b-41d4-a716-446655440000"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

## Data Models

### Article Model
```javascript
{
  id: String,
  title: String,
  excerpt: String,
  content: String,
  author: {
    name: String,
    email: String
  },
  tags: [String],
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
  stats: {
    views: Number,
    likes: Number,
    comments: Number,
    shares: Number
  },
  status: String // draft, published, archived
}
```

### User Model
```javascript
{
  id: String,
  name: String,
  email: String,
  jobTitle: String,
  organization: String,
  bio: String,
  role: String, // admin, user
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  id: String,
  articleId: String,
  content: String,
  author: String,
  email: String,
  createdAt: Date
}
```

### Access Log Model
```javascript
{
  id: String,
  timestamp: Date,
  type: String, // success, failed, lockout, logout
  details: String,
  ip: String,
  userAgent: String,
  userId: String
}
```

## Error Handling

### Error Response Format
```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  }
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `ACCESS_DENIED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `INTERNAL_ERROR`: Server internal error

### Example Error Responses

#### Authentication Required
```javascript
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required for this endpoint"
  }
}
```

#### Validation Error
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "title": "Title is required",
      "content": "Content must be at least 100 characters"
    }
  }
}
```

## Rate Limiting

### Public Endpoints
- **Comments**: 5 per minute per IP
- **Likes**: 10 per minute per IP
- **Shares**: 5 per minute per IP
- **Contact**: 3 per hour per IP

### Admin Endpoints
- **Authentication**: 5 attempts per 15 minutes
- **Article Creation**: 10 per hour
- **Article Updates**: 50 per hour

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642233600
```

## Security

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### Input Validation
All inputs are validated using Zod schemas:

```javascript
const articleSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(100),
  tags: z.array(z.string()).max(10),
  status: z.enum(['draft', 'published', 'archived'])
});
```

### CORS Configuration
```javascript
{
  origin: ['http://localhost:3000', 'https://cyberscroll.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

This API documentation provides comprehensive information about all endpoints, data models, error handling, and security measures for the Cybersecurity Blog application. 