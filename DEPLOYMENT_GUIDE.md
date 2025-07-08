# Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Domain & SSL](#domain--ssl)
7. [Monitoring & Logging](#monitoring--logging)
8. [Security Hardening](#security-hardening)
9. [Performance Optimization](#performance-optimization)
10. [Backup & Recovery](#backup--recovery)
11. [Troubleshooting](#troubleshooting)

## Overview

This guide covers the complete deployment process for the Cybersecurity Blog application, including frontend, backend, database, and production security considerations.

### Deployment Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   - Render.com  │    │   - Render.com  │    │   - MongoDB Atlas│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Environment Setup

### Prerequisites
```bash
# Required software
Node.js >= 16.0.0
npm >= 8.0.0
Git >= 2.30.0
MongoDB >= 5.0 (for local development)
```

### Environment Variables

#### Frontend (.env)
```bash
# Development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
REACT_APP_GA_TRACKING_ID=GA_TRACKING_ID

# Production
REACT_APP_API_URL=https://api.cyberscroll.com
REACT_APP_ENVIRONMENT=production
REACT_APP_GA_TRACKING_ID=GA_TRACKING_ID
```

#### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cyberscroll
MONGODB_URI_DEV=mongodb://localhost:27017/cyberscroll

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=30m

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security
CORS_ORIGIN=https://cyberscroll.com
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Admin Credentials (should be hashed in production)
ADMIN_EMAIL=francis@cyberscroll.com
ADMIN_PASSWORD_HASH=hashed-password
ADMIN_PIN_HASH=hashed-pin
```

## Frontend Deployment

### Render.com Deployment

#### Step 1: Connect Repository
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure build settings

#### Step 2: Build Configuration
```bash
# Build Command
npm run build

# Publish Directory
build

# Environment Variables
REACT_APP_API_URL=https://api.cyberscroll.com
REACT_APP_ENVIRONMENT=production
```

#### Step 3: Custom Domain
1. Go to your site settings
2. Click "Custom Domain"
3. Add your domain: `cyberscroll.com`
4. Configure DNS records

### Alternative: Vercel Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 3: Configure Environment
```bash
# Set environment variables
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_ENVIRONMENT
```

### Build Optimization

#### Production Build
```bash
# Create optimized build
npm run build

# Analyze bundle size
npm run analyze
```

#### Bundle Optimization
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

## Backend Deployment

### Render.com API Deployment

#### Step 1: Create Web Service
1. Go to Render.com dashboard
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure settings

#### Step 2: Build Configuration
```bash
# Build Command
cd backend && npm install

# Start Command
npm start

# Environment Variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
```

#### Step 3: Health Check
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### Alternative: Railway Deployment

#### Step 1: Setup Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

#### Step 2: Deploy
```bash
# Deploy to Railway
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your-mongodb-uri
```

### PM2 Deployment (Self-hosted)

#### Step 1: Install PM2
```bash
npm install -g pm2
```

#### Step 2: Create Ecosystem File
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'cyberscroll-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

#### Step 3: Deploy
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## Database Setup

### MongoDB Atlas Setup

#### Step 1: Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster
3. Choose cloud provider and region
4. Select cluster tier (M0 for free tier)

#### Step 2: Configure Network Access
1. Go to Network Access
2. Add IP address: `0.0.0.0/0` (for all IPs)
3. Or add specific IP addresses

#### Step 3: Create Database User
1. Go to Database Access
2. Add new database user
3. Set username and password
4. Assign appropriate roles

#### Step 4: Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/cyberscroll?retryWrites=true&w=majority
```

### Database Schema Setup

#### Step 1: Create Collections
```javascript
// Connect to MongoDB
use cyberscroll

// Create collections
db.createCollection('articles')
db.createCollection('users')
db.createCollection('comments')
db.createCollection('access_logs')
```

#### Step 2: Create Indexes
```javascript
// Articles collection
db.articles.createIndex({ "title": "text", "content": "text" })
db.articles.createIndex({ "status": 1 })
db.articles.createIndex({ "publishedAt": -1 })
db.articles.createIndex({ "tags": 1 })

// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })

// Comments collection
db.comments.createIndex({ "articleId": 1 })
db.comments.createIndex({ "createdAt": -1 })

// Access logs collection
db.access_logs.createIndex({ "timestamp": -1 })
db.access_logs.createIndex({ "type": 1 })
db.access_logs.createIndex({ "userId": 1 })
```

#### Step 3: Insert Initial Data
```javascript
// Insert admin user
db.users.insertOne({
  _id: ObjectId("550e8400e29b41d4a716446655440000"),
  name: "Francis Bockarie",
  email: "francis@cyberscroll.com",
  jobTitle: "IT Security Professional",
  organization: "CyberScroll Security",
  bio: "Cybersecurity professional with expertise in threat intelligence, incident response, and security architecture.",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Domain & SSL

### Domain Configuration

#### Step 1: Purchase Domain
1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Domain: `cyberscroll.com`

#### Step 2: Configure DNS
```bash
# A Records
@     A     76.76.19.19    # Render.com IP
www   A     76.76.19.19    # Render.com IP

# CNAME Records
api   CNAME your-api-service.onrender.com
```

#### Step 3: SSL Certificate
- Render.com provides automatic SSL certificates
- Certificates are automatically renewed
- Force HTTPS redirect

### Custom SSL (Self-hosted)
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d cyberscroll.com -d www.cyberscroll.com

# Configure Nginx
server {
    listen 443 ssl;
    server_name cyberscroll.com www.cyberscroll.com;
    
    ssl_certificate /etc/letsencrypt/live/cyberscroll.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cyberscroll.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Logging

### Application Monitoring

#### Step 1: Setup Logging
```javascript
// winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

#### Step 2: Health Monitoring
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### Step 3: Performance Monitoring
```javascript
// Add performance middleware
const morgan = require('morgan');
const helmet = require('helmet');

app.use(helmet());
app.use(morgan('combined'));
```

### Error Tracking

#### Step 1: Setup Sentry
```javascript
// Install Sentry
npm install @sentry/node @sentry/tracing

// Initialize Sentry
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: 'your-sentry-dsn',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

## Security Hardening

### Production Security Checklist

#### Step 1: Environment Security
- [ ] Use environment variables for all secrets
- [ ] Hash admin passwords and PINs
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Configure CORS properly

#### Step 2: Application Security
```javascript
// Security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

#### Step 3: Database Security
- [ ] Use MongoDB Atlas with network restrictions
- [ ] Enable database authentication
- [ ] Use connection string with SSL
- [ ] Regular security updates

#### Step 4: Admin Security
```javascript
// Hash admin credentials
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const hashPin = async (pin) => {
  return await bcrypt.hash(pin, 12);
};

// Store hashed credentials in environment
ADMIN_PASSWORD_HASH=await hashPassword('CyberScroll2024!')
ADMIN_PIN_HASH=await hashPin('1337')
```

## Performance Optimization

### Frontend Optimization

#### Step 1: Code Splitting
```javascript
// Route-based splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Articles = React.lazy(() => import('./pages/Articles'));

// Component-based splitting
const AdminLoginModal = React.lazy(() => import('./components/AdminLoginModal'));
```

#### Step 2: Image Optimization
```javascript
// Use WebP format
// Implement lazy loading
// Use responsive images
<img 
  src="image.webp" 
  loading="lazy"
  srcSet="image-300.webp 300w, image-600.webp 600w, image-900.webp 900w"
  sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
  alt="Description"
/>
```

#### Step 3: Caching Strategy
```javascript
// Service Worker for caching
// Cache static assets
// Implement offline functionality
```

### Backend Optimization

#### Step 1: Database Optimization
```javascript
// Use indexes for frequently queried fields
// Implement pagination
// Use aggregation for complex queries
```

#### Step 2: Caching
```javascript
// Redis for session storage
// Cache frequently accessed data
// Implement cache invalidation
```

#### Step 3: Compression
```javascript
const compression = require('compression');
app.use(compression());
```

## Backup & Recovery

### Database Backup

#### Step 1: Automated Backups
```bash
# MongoDB Atlas provides automated backups
# Configure backup schedule
# Set retention period
```

#### Step 2: Manual Backup
```bash
# Export database
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/cyberscroll"

# Import database
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/cyberscroll" dump/
```

### Application Backup

#### Step 1: Code Backup
- Use Git for version control
- Regular commits and pushes
- Tag releases for easy rollback

#### Step 2: Environment Backup
```bash
# Export environment variables
env | grep -E '^(REACT_APP_|NODE_|MONGODB_|JWT_|EMAIL_)' > .env.backup

# Restore environment variables
source .env.backup
```

### Disaster Recovery Plan

#### Step 1: Recovery Procedures
1. **Database Recovery**: Restore from MongoDB Atlas backup
2. **Application Recovery**: Redeploy from Git repository
3. **Domain Recovery**: Update DNS records if needed

#### Step 2: Testing Recovery
- Test backup restoration monthly
- Document recovery procedures
- Train team on recovery process

## Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm audit fix

# Verify environment variables
echo $REACT_APP_API_URL
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/cyberscroll"

# Check network access
# Verify connection string
# Test with MongoDB Compass
```

#### SSL Certificate Issues
```bash
# Check certificate validity
openssl s_client -connect cyberscroll.com:443 -servername cyberscroll.com

# Renew certificate if needed
sudo certbot renew
```

### Performance Issues

#### Slow Loading
- Check bundle size
- Optimize images
- Implement lazy loading
- Use CDN for static assets

#### High Memory Usage
- Monitor memory usage
- Implement garbage collection
- Optimize database queries
- Use connection pooling

### Security Issues

#### Unauthorized Access
- Check admin authentication logs
- Verify JWT token validation
- Review access control policies
- Monitor failed login attempts

#### Data Breach Response
1. **Immediate Actions**:
   - Change admin credentials
   - Review access logs
   - Check for suspicious activity
   - Notify stakeholders

2. **Investigation**:
   - Analyze security logs
   - Identify breach source
   - Assess data exposure
   - Document incident

3. **Recovery**:
   - Patch security vulnerabilities
   - Implement additional security measures
   - Update security policies
   - Conduct security audit

---

This deployment guide provides comprehensive instructions for deploying the Cybersecurity Blog application to production with proper security, monitoring, and performance optimization. 