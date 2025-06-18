const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { z } = require('zod');
const { fileUploadSchema, uuidSchema } = require('../validations/schemas');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/zip',
    'application/x-rar-compressed',
    'text/plain',
    'text/markdown'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, images, archives, and text files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Mock documents database (in production, use a real database)
let documents = [
  {
    id: '1',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    fileName: 'Security_Audit_Report_2024.pdf',
    originalName: 'Security_Audit_Report_2024.pdf',
    filePath: 'uploads/security-audit-2024.pdf',
    fileType: 'application/pdf',
    fileSize: 2400000,
    tags: ['Audit', 'Report'],
    linkedArticleId: '1',
    description: 'Annual security audit report',
    uploadedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    fileName: 'Vendor_Assessment_Template.docx',
    originalName: 'Vendor_Assessment_Template.docx',
    filePath: 'uploads/vendor-assessment-template.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 1800000,
    tags: ['Template', 'VendorRisk'],
    linkedArticleId: null,
    description: 'Template for vendor risk assessments',
    uploadedAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

// Helper function to find document by ID
const findDocumentById = (id) => {
  return documents.find(doc => doc.id === id);
};

// Helper function to get documents by user
const getDocumentsByUser = (userId) => {
  return documents.filter(doc => doc.userId === userId);
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// @route   POST /api/uploads
// @desc    Upload files
// @access  Private
router.post('/', authenticateToken, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one file to upload'
      });
    }

    const uploadedFiles = [];
    const { tags, linkedArticleId, description } = req.body;

    req.files.forEach(file => {
      const newDocument = {
        id: uuidv4(),
        userId: req.user.userId,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
        tags: tags ? JSON.parse(tags) : [],
        linkedArticleId: linkedArticleId || null,
        description: description || '',
        uploadedAt: new Date(),
        updatedAt: new Date()
      };

      documents.push(newDocument);
      uploadedFiles.push(newDocument);
    });

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'Internal server error'
    });
  }
});

// @route   GET /api/uploads
// @desc    Get user's uploaded files
// @access  Private
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, type, page = 1, limit = 10 } = req.query;
    
    let userDocuments = getDocumentsByUser(req.user.userId);

    // Filter by search query
    if (search) {
      const searchTerm = search.toLowerCase();
      userDocuments = userDocuments.filter(doc =>
        doc.originalName.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by file type
    if (type) {
      if (type === 'images') {
        userDocuments = userDocuments.filter(doc => 
          doc.fileType.startsWith('image/')
        );
      } else if (type === 'documents') {
        userDocuments = userDocuments.filter(doc => 
          doc.fileType.includes('pdf') || doc.fileType.includes('word')
        );
      } else if (type === 'archives') {
        userDocuments = userDocuments.filter(doc => 
          doc.fileType.includes('zip') || doc.fileType.includes('rar')
        );
      } else {
        userDocuments = userDocuments.filter(doc => 
          doc.fileType.includes(type)
        );
      }
    }

    // Pagination
    const total = userDocuments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedDocuments = userDocuments.slice(startIndex, endIndex);

    // Add formatted file size
    const documentsWithFormattedSize = paginatedDocuments.map(doc => ({
      ...doc,
      formattedSize: formatFileSize(doc.fileSize)
    }));

    res.json({
      documents: documentsWithFormattedSize,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      error: 'Failed to get documents',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/uploads/:id
// @desc    Get document by ID
// @access  Private
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const document = findDocumentById(id);
    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist'
      });
    }

    // Check if user owns the document
    if (document.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own documents'
      });
    }

    res.json({
      document: {
        ...document,
        formattedSize: formatFileSize(document.fileSize)
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Get document error:', error);
    res.status(500).json({
      error: 'Failed to get document',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/uploads/:id
// @desc    Update document metadata
// @access  Private
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const document = findDocumentById(id);
    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist'
      });
    }

    // Check if user owns the document
    if (document.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own documents'
      });
    }

    // Update document metadata
    const { tags, linkedArticleId, description } = req.body;
    
    if (tags !== undefined) document.tags = tags;
    if (linkedArticleId !== undefined) document.linkedArticleId = linkedArticleId;
    if (description !== undefined) document.description = description;
    
    document.updatedAt = new Date();

    res.json({
      message: 'Document updated successfully',
      document: {
        ...document,
        formattedSize: formatFileSize(document.fileSize)
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Update document error:', error);
    res.status(500).json({
      error: 'Failed to update document',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/uploads/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const documentIndex = documents.findIndex(doc => doc.id === id);
    if (documentIndex === -1) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist'
      });
    }

    const document = documents[documentIndex];

    // Check if user owns the document
    if (document.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own documents'
      });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Remove from database
    documents.splice(documentIndex, 1);

    res.json({
      message: 'Document deleted successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Delete document error:', error);
    res.status(500).json({
      error: 'Failed to delete document',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/uploads/download/:id
// @desc    Download document
// @access  Private
router.get('/download/:id', authenticateToken, (req, res) => {
  try {
    const { id } = uuidSchema.parse({ id: req.params.id });
    
    const document = findDocumentById(id);
    if (!document) {
      return res.status(404).json({
        error: 'Document not found',
        message: 'Document does not exist'
      });
    }

    // Check if user owns the document
    if (document.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only download your own documents'
      });
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File does not exist on server'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Type', document.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(document.filePath);
    fileStream.pipe(res);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.errors[0].message
      });
    }

    console.error('Download document error:', error);
    res.status(500).json({
      error: 'Failed to download document',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 