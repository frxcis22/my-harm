const { z } = require('zod');

// Verification schemas
const verificationCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits')
});

const sendCodeSchema = z.object({
  email: z.string().email('Invalid email address')
});

const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  jobTitle: z.string().optional(),
  organization: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional()
});

// Article validation schemas
const articleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  tags: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  visibility: z.enum(['private', 'public']).default('private'),
  status: z.enum(['draft', 'published']).default('draft')
});

const articleUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  visibility: z.enum(['private', 'public']).optional(),
  status: z.enum(['draft', 'published']).optional()
});

const articleQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default('10'),
  search: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'all']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'views']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Category validation schemas
const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Category name can only contain letters, numbers, underscores, and hyphens'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional()
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Category name can only contain letters, numbers, underscores, and hyphens').optional(),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional()
});

// File upload validation schemas
const fileUploadSchema = z.object({
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  linkedArticleId: z.string().uuid().optional(),
  description: z.string().max(500).optional()
});

// Search validation schema
const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['articles', 'documents', 'all']).default('all'),
  page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(50)).default('10')
});

// Pagination schema
const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// UUID validation schema
const uuidSchema = z.object({
  id: z.string().uuid('Invalid UUID format')
});

// Export/Import schema
const exportSchema = z.object({
  format: z.enum(['json', 'markdown', 'pdf']).default('json'),
  includeDocuments: z.boolean().default(true),
  includeSettings: z.boolean().default(true),
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional()
  }).optional()
});

module.exports = {
  // Verification schemas
  verificationCodeSchema,
  sendCodeSchema,
  
  // User schemas
  userUpdateSchema,
  
  // Article schemas
  articleCreateSchema,
  articleUpdateSchema,
  articleQuerySchema,
  
  // Category schemas
  categoryCreateSchema,
  categoryUpdateSchema,
  
  // File schemas
  fileUploadSchema,
  
  // Search and pagination
  searchSchema,
  paginationSchema,
  
  // Utility schemas
  uuidSchema,
  exportSchema
}; 