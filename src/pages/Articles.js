import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicAPI } from '../services/api';
import articleAggregator from '../services/articleAggregator';
import CuratedArticleCard from '../components/CuratedArticleCard';
import ArticleSearchFilters from '../components/ArticleSearchFilters';

const Articles = () => {
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [curatedArticles, setCuratedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState({});
  const [sharing, setSharing] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'original', 'curated'
  const [visitorId] = useState(() => {
    // Generate or retrieve visitor ID from localStorage
    let id = localStorage.getItem('visitorId');
    if (!id) {
      id = 'visitor_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', id);
    }
    return id;
  });

  useEffect(() => {
    fetchArticles();
    fetchCuratedArticles();
  }, []);

  // Handle URL search parameters
  const handleSearchFromURL = useCallback(async (query) => {
    if (!query.trim()) {
      await fetchCuratedArticles();
      return;
    }

    try {
      setIsSearching(true);
      const results = await articleAggregator.searchCuratedArticles(query, filters);
      setCuratedArticles(results);
      setActiveTab('curated'); // Switch to curated tab when searching
    } catch (err) {
      console.error('Error searching articles from URL:', err);
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlSearchQuery = searchParams.get('search');
    
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      // Automatically perform search when coming from header search
      handleSearchFromURL(urlSearchQuery);
    }
  }, [location.search, handleSearchFromURL]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getArticles();
      setArticles(response.articles);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuratedArticles = async () => {
    try {
      const curated = await articleAggregator.curateArticles();
      setCuratedArticles(curated);
    } catch (err) {
      console.error('Error fetching curated articles:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && Object.keys(filters).length === 0) {
      await fetchCuratedArticles();
      return;
    }

    try {
      setIsSearching(true);
      const results = await articleAggregator.searchCuratedArticles(searchQuery, filters);
      setCuratedArticles(results);
    } catch (err) {
      console.error('Error searching articles:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLike = async (articleId) => {
    try {
      setLiking(prev => ({ ...prev, [articleId]: true }));
      
      // Check if it's a curated article
      const curatedArticle = curatedArticles.find(a => a.id === articleId);
      if (curatedArticle) {
        // For curated articles, just update local state
        setCuratedArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, likeCount: article.likeCount + 1 }
            : article
        ));
        return;
      }

      // Handle original articles
      const response = await publicAPI.likeArticle(articleId);
      
      // Update article like count
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, likeCount: response.likeCount }
          : article
      ));
      
    } catch (err) {
      console.error('Error liking article:', err);
    } finally {
      setLiking(prev => ({ ...prev, [articleId]: false }));
    }
  };

  const handleShare = async (articleId, platform) => {
    try {
      setSharing(prev => ({ ...prev, [articleId]: true }));
      
      // Check if it's a curated article
      const curatedArticle = curatedArticles.find(a => a.id === articleId);
      if (curatedArticle) {
        // Share curated article
        const shareText = `Check out this curated cybersecurity article: ${curatedArticle.title}`;
        const shareUrl = curatedArticle.sourceUrl;
        
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
        return;
      }

      // Handle original articles
      await publicAPI.shareArticle(articleId, { platform, visitorId });

      const article = articles.find(a => a.id === articleId);
      const shareUrl = window.location.origin + `/articles/${articleId}`;
      const shareText = `Check out this article by Francis Bockarie: ${article.title}`;
      
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
      
    } catch (err) {
      console.error('Error sharing article:', err);
    } finally {
      setSharing(prev => ({ ...prev, [articleId]: false }));
    }
  };

  const handleComment = async (articleId) => {
    if (!newComment.author || !newComment.email || !newComment.content) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setCommenting(true);
      await publicAPI.addComment(articleId, newComment);
      
      // Update article comment count
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, commentCount: article.commentCount + 1 }
          : article
      ));
      
      // Clear form
      setNewComment({ author: '', email: '', content: '' });
      
      // Refresh comments if viewing them
      if (selectedArticle?.id === articleId) {
        fetchComments(articleId);
      }
      
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const fetchComments = async (articleId) => {
    try {
      const response = await publicAPI.getComments(articleId);
      setSelectedArticle(prev => ({ ...prev, comments: response.comments }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const toggleComments = async (article) => {
    if (selectedArticle?.id === article.id) {
      setSelectedArticle(null);
      setShowComments(false);
    } else {
      setSelectedArticle(article);
      setShowComments(true);
      await fetchComments(article.id);
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
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Articles</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchArticles}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CyberScroll Security Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Original cybersecurity insights by Francis Bockarie + AI-curated articles from trusted sources
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>🔍 Discover, search, and stay informed with the latest cybersecurity content</p>
          </div>
        </div>

        {/* Search and Filters */}
        <ArticleSearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        {/* Content Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Articles ({articles.length + curatedArticles.length})
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'original'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Original ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('curated')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'curated'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Curated ({curatedArticles.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content Display */}
        {(() => {
          let displayArticles = [];
          let emptyMessage = '';

          switch (activeTab) {
            case 'all':
              displayArticles = [...articles, ...curatedArticles];
              emptyMessage = 'No articles available';
              break;
            case 'original':
              displayArticles = articles;
              emptyMessage = 'No original articles yet. Check back soon for new content from Francis Bockarie!';
              break;
            case 'curated':
              displayArticles = curatedArticles;
              emptyMessage = 'No curated articles available at the moment.';
              break;
            default:
              displayArticles = [...articles, ...curatedArticles];
              emptyMessage = 'No articles available';
          }

          if (displayArticles.length === 0) {
            return (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Articles Found</h2>
                <p className="text-gray-600">{emptyMessage}</p>
              </div>
            );
          }

          return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayArticles.map((article) => {
                // Check if it's a curated article
                if (article.isCurated) {
                  return (
                    <CuratedArticleCard
                      key={article.id}
                      article={article}
                      onLike={handleLike}
                      onShare={handleShare}
                      isLiking={liking[article.id]}
                      isSharing={sharing[article.id]}
                    />
                  );
                }

                // Original article display
                return (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(article.publishedAt)}
                    </span>
                    <div className="flex space-x-2">
                      {article.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="font-medium text-blue-600">By Francis Bockarie</span>
                    <div className="flex items-center space-x-4">
                      <span>👁️ {article.viewCount}</span>
                      <span>❤️ {article.likeCount}</span>
                      <span>💬 {article.commentCount}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to={`/articles/${article.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Read Article
                    </Link>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLike(article.id)}
                        disabled={liking[article.id]}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {liking[article.id] ? '❤️' : '🤍'} Like
                      </button>
                      
                      <button
                        onClick={() => toggleComments(article)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        💬 Comments
                      </button>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleShare(article.id, 'twitter')}
                        disabled={sharing[article.id]}
                        className="flex-1 bg-blue-400 text-white py-2 px-3 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm"
                      >
                        🐦 Twitter
                      </button>
                      <button
                        onClick={() => handleShare(article.id, 'facebook')}
                        disabled={sharing[article.id]}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                      >
                        📘 Facebook
                      </button>
                      <button
                        onClick={() => handleShare(article.id, 'linkedin')}
                        disabled={sharing[article.id]}
                        className="flex-1 bg-blue-800 text-white py-2 px-3 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 text-sm"
                      >
                        💼 LinkedIn
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {selectedArticle?.id === article.id && showComments && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Comments ({selectedArticle.comments?.length || 0})
                    </h3>
                    
                    {/* Add Comment Form */}
                    <div className="mb-6 p-4 bg-white rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-3">Add a Comment</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Your name"
                            value={newComment.author}
                            onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            placeholder="Your email"
                            value={newComment.email}
                            onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <textarea
                          placeholder="Your comment..."
                          value={newComment.content}
                          onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleComment(article.id)}
                          disabled={commenting}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {commenting ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {selectedArticle.comments?.length > 0 ? (
                        selectedArticle.comments.map((comment) => (
                          <div key={comment.id} className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{comment.author}</span>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">💬</div>
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Articles; 