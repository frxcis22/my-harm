import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { ThumbsUp, MessageCircle, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [visitorId] = useState(() => {
    let id = localStorage.getItem('visitorId');
    if (!id) {
      id = 'visitor_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', id);
    }
    return id;
  });

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      // Try to fetch as curated article first
      let response;
      try {
        response = await publicAPI.getCuratedArticle(id);
        setArticle({ ...response.article, isCurated: true });
      } catch (err) {
        // If not found as curated, try as original article
        response = await publicAPI.getArticle(id);
        setArticle(response.article);
      }
    } catch (err) {
      setError('Article not found');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await publicAPI.getComments(id);
      setComments(response.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleLike = async () => {
    try {
      setLiking(true);
      const response = await publicAPI.likeArticle(id, { visitorId });
      setArticle(prev => ({ ...prev, likeCount: response.likeCount }));
      toast.success('Article liked!');
    } catch (err) {
      console.error('Error liking article:', err);
      toast.error('Failed to like article');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async (platform) => {
    try {
      setSharing(true);
      
      let shareUrl, shareText;
      
      if (article.isCurated) {
        shareUrl = article.sourceUrl;
        shareText = `Check out this curated cybersecurity article: ${article.title}`;
      } else {
        shareUrl = window.location.href;
        shareText = `Check out this article by Francis Bockarie: ${article.title}`;
      }
      
      let shareLink = '';
      switch (platform) {
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'linkedin':
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'email':
          shareLink = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
          break;
        default:
          break;
      }
      
      if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=400');
      }
      
      await publicAPI.shareArticle(id, { platform, visitorId });
      toast.success('Article shared!');
    } catch (err) {
      console.error('Error sharing article:', err);
      toast.error('Failed to share article');
    } finally {
      setSharing(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.author || !newComment.email || !newComment.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCommenting(true);
      await publicAPI.addComment(id, newComment);
      
      // Refresh comments
      await fetchComments();
      
      // Clear form
      setNewComment({ author: '', email: '', content: '' });
      
      toast.success('Comment posted!');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to post comment');
    } finally {
      setCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
          <button 
            onClick={() => navigate('/articles')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </button>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {article.isCurated && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Curated
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
              </div>
              {article.isCurated && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Original
                </a>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-4">
                {article.excerpt}
              </p>
            )}
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="p-8">
            {article.isCurated ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {article.content || article.description || 'This is a curated article from a trusted cybersecurity source. Click "View Original" above to read the full article.'}
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Source:</strong> {article.sourceName || 'Trusted Cybersecurity Source'}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    This article has been curated by our AI system for relevance and quality.
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {article.content || 'Article content will be displayed here.'}
                </p>
              </div>
            )}
          </div>

          {/* Engagement Section */}
          <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  <ThumbsUp className="w-6 h-6" strokeWidth={2} />
                  <span className="text-sm font-medium">{article.likeCount || 0}</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowComments(!showComments);
                    if (!showComments) {
                      fetchComments();
                    }
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-6 h-6" strokeWidth={2} />
                  <span className="text-sm font-medium">{comments.length}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Share:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  disabled={sharing}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                  title="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  disabled={sharing}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                  title="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  disabled={sharing}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                  title="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="p-8 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Comments ({comments.length})
              </h3>
              
              {/* Add Comment Form */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Add a Comment</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={newComment.author}
                      onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={newComment.email}
                      onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Your comment..."
                    value={newComment.content}
                    onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleComment}
                    disabled={commenting}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {commenting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
              
              {/* Comments List */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-lg">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 