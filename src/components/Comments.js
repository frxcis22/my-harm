import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Calendar, ThumbsUp, ThumbsDown, Flag, Reply, Send } from 'lucide-react';
import { sanitizeHTML, sanitizeInput, validationSchemas, logSecurityEvent } from '../utils/security';
import toast from 'react-hot-toast';

const Comments = ({ articleId, comments = [], onAddComment, onModerate }) => {
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostLiked
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending

  // Rate limiting for comment submission
  const [lastSubmission, setLastSubmission] = useState(0);
  const SUBMISSION_COOLDOWN = 30000; // 30 seconds

  // Validate comment data
  const validateComment = (commentData) => {
    try {
      validationSchemas.comment.parse(commentData);
      return { isValid: true, errors: [] };
    } catch (error) {
      return { 
        isValid: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
  };

  // Handle comment submission with security measures
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmission < SUBMISSION_COOLDOWN) {
      const remainingTime = Math.ceil((SUBMISSION_COOLDOWN - (now - lastSubmission)) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before posting another comment`);
      return;
    }

    // Validate comment
    const validation = validateComment({
      ...newComment,
      articleId
    });

    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    // Sanitize inputs
    const sanitizedComment = {
      name: sanitizeInput(newComment.name),
      email: sanitizeInput(newComment.email),
      content: sanitizeHTML(newComment.content),
      articleId
    };

    // Check for spam indicators
    const spamScore = calculateSpamScore(sanitizedComment);
    if (spamScore > 0.7) {
      toast.error('Comment flagged as potential spam. Please review your content.');
      logSecurityEvent('spam_detected', { 
        spamScore, 
        comment: sanitizedComment.content.substring(0, 100) 
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Log comment submission for security
      logSecurityEvent('comment_submitted', {
        articleId,
        commentLength: sanitizedComment.content.length,
        hasEmail: !!sanitizedComment.email
      });

      await onAddComment(sanitizedComment);
      
      // Reset form
      setNewComment({ name: '', email: '', content: '' });
      setReplyTo(null);
      setShowReplyForm(false);
      
      toast.success('Comment submitted successfully! It will be reviewed before appearing.');
      setLastSubmission(now);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment. Please try again.');
      logSecurityEvent('comment_submission_error', { error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple spam detection
  const calculateSpamScore = (comment) => {
    let score = 0;
    const content = comment.content.toLowerCase();
    const name = comment.name.toLowerCase();
    
    // Check for suspicious patterns
    const spamPatterns = [
      /buy now/i,
      /click here/i,
      /free money/i,
      /make money fast/i,
      /viagra/i,
      /casino/i,
      /loan/i,
      /http:\/\/[^\s]+/g, // Multiple URLs
      /[A-Z]{5,}/g, // Excessive caps
      /\d{10,}/g // Long number sequences
    ];
    
    spamPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        score += matches.length * 0.1;
      }
    });
    
    // Check for suspicious name patterns
    if (name.includes('http') || name.includes('www')) {
      score += 0.5;
    }
    
    // Check for excessive links
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (linkCount > 2) {
      score += linkCount * 0.2;
    }
    
    return Math.min(score, 1);
  };

  // Handle reply submission
  const handleReply = async (parentComment) => {
    if (!newComment.content.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    const replyData = {
      ...newComment,
      articleId,
      parentId: parentComment.id,
      replyTo: parentComment.name
    };

    await handleSubmitComment(new Event('submit'), replyData);
  };

  // Sort and filter comments
  const getFilteredComments = () => {
    let filtered = comments.filter(comment => {
      if (filterStatus === 'all') return true;
      return comment.status === filterStatus;
    });

    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLiked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render comment tree
  const renderComment = (comment, level = 0) => {
    const replies = comments.filter(c => c.parentId === comment.id);
    
    return (
      <div key={comment.id} className={`comment-item ${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {sanitizeInput(comment.name)}
                </h4>
                {comment.status === 'pending' && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Pending Review
                  </span>
                )}
                {comment.status === 'approved' && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Approved
                  </span>
                )}
              </div>
              
              <div 
                className="text-sm text-gray-700 mb-3"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content) }}
              />
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(comment.createdAt)}</span>
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{comment.likes || 0}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleDislike(comment.id)}
                      className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span>{comment.dislikes || 0}</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {level === 0 && (
                    <button
                      onClick={() => {
                        setReplyTo(comment);
                        setShowReplyForm(true);
                      }}
                      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                    >
                      <Reply className="h-3 w-3" />
                      <span>Reply</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleReport(comment.id)}
                    className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                  >
                    <Flag className="h-3 w-3" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
              
              {/* Reply form */}
              {showReplyForm && replyTo?.id === comment.id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(comment);
                  }}>
                    <textarea
                      value={newComment.content}
                      onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={`Reply to ${comment.name}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReplyForm(false);
                          setReplyTo(null);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !newComment.content.trim()}
                        className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Reply'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Render replies */}
        {replies.map(reply => renderComment(reply, level + 1))}
      </div>
    );
  };

  // Handle comment actions
  const handleLike = (commentId) => {
    logSecurityEvent('comment_liked', { commentId });
    // Implement like functionality
  };

  const handleDislike = (commentId) => {
    logSecurityEvent('comment_disliked', { commentId });
    // Implement dislike functionality
  };

  const handleReport = (commentId) => {
    logSecurityEvent('comment_reported', { commentId });
    toast.success('Comment reported. Thank you for helping keep our community safe.');
  };

  const filteredComments = getFilteredComments();

  return (
    <div className="comments-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({filteredComments.length})</span>
        </h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Comments</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Leave a Comment</h4>
        <form onSubmit={handleSubmitComment}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={newComment.name}
                onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={newComment.email}
                onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment *
            </label>
            <textarea
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Share your thoughts..."
              required
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newComment.content.length}/1000 characters
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Comments are moderated and may take time to appear.
            </p>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.name.trim() || !newComment.email.trim() || !newComment.content.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {filteredComments.length > 0 ? (
          filteredComments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments; 