import DOMPurify from 'dompurify';
import { z } from 'zod';

// Security utility functions for the cybersecurity blog

/**
 * Input validation schemas using Zod
 */
export const validationSchemas = {
  // Email validation
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  
  // Password validation (strong password requirements)
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  // Article validation
  article: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    excerpt: z.string().max(500, 'Excerpt too long'),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()).max(10, 'Too many tags'),
    published: z.boolean().optional()
  }),
  
  // Comment validation
  comment: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email format'),
    content: z.string().min(1, 'Comment is required').max(1000, 'Comment too long'),
    articleId: z.string().min(1, 'Article ID is required')
  }),
  
  // Search validation
  search: z.object({
    query: z.string().min(1, 'Search query is required').max(100, 'Query too long'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty) return '';
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });
};

/**
 * Sanitize user input for safe display
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (token, storedToken) => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) { // 15 minutes
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Password strength checker
 */
export const checkPasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score,
    isStrong: score >= 4,
    checks,
    feedback: getPasswordFeedback(checks)
  };
};

const getPasswordFeedback = (checks) => {
  const feedback = [];
  if (!checks.length) feedback.push('At least 8 characters');
  if (!checks.uppercase) feedback.push('One uppercase letter');
  if (!checks.lowercase) feedback.push('One lowercase letter');
  if (!checks.numbers) feedback.push('One number');
  if (!checks.special) feedback.push('One special character');
  return feedback;
};

/**
 * Secure file upload validation
 */
export const validateFileUpload = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
  const errors = [];
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = /\.(php|jsp|asp|aspx|exe|bat|cmd|sh|js|vbs)$/i;
  if (suspiciousPatterns.test(file.name)) {
    errors.push('File type not allowed for security reasons');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate secure random string
 */
export const generateSecureString = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash sensitive data (client-side, for demo purposes)
 * In production, use server-side hashing
 */
export const hashData = async (data) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate and sanitize search queries
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 100); // Limit length
};

/**
 * Security headers configuration
 */
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

/**
 * Log security events
 */
export const logSecurityEvent = (event, details = {}) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    referrer: document.referrer
  };
  
  // In production, send to secure logging service
  console.warn('Security Event:', securityLog);
  
  // Store locally for admin review
  try {
    const existingLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    existingLogs.unshift(securityLog);
    
    // Keep only last 100 security events
    if (existingLogs.length > 100) {
      existingLogs.splice(100);
    }
    
    localStorage.setItem('securityLogs', JSON.stringify(existingLogs));
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

/**
 * Check if user is on a secure connection
 */
export const isSecureConnection = () => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

/**
 * Validate environment variables
 */
export const validateEnvironment = () => {
  const requiredVars = [
    'REACT_APP_API_URL',
    'REACT_APP_ENVIRONMENT'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

export default {
  validationSchemas,
  sanitizeHTML,
  sanitizeInput,
  generateCSRFToken,
  validateCSRFToken,
  RateLimiter,
  checkPasswordStrength,
  validateFileUpload,
  generateSecureString,
  hashData,
  sanitizeSearchQuery,
  securityHeaders,
  logSecurityEvent,
  isSecureConnection,
  validateEnvironment
}; 