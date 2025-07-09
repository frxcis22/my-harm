import React from 'react';
import { ExternalLink, Clock, User, TrendingUp, Shield, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CuratedArticleCard = ({ article, onLike, onShare, onComment, isLiking, isSharing }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExternalLink = (e) => {
    e.preventDefault();
    window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  const handleMinimalShare = (article) => {
    const shareUrl = article.sourceUrl || (window.location.origin + `/articles/${article.id}`);
    const shareText = `Check out this article: ${article.title}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      {/* Article Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Curated
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Source Attribution */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Source:</span>
            <a 
              href={article.sourceUrl}
              onClick={handleExternalLink}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.source}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
            {article.difficulty}
          </span>
        </div>

        {/* Article Meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {formatDate(article.publishedAt)}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {article.readTime}
            </span>
            <span className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {article.author}
            </span>
          </div>
        </div>

        {/* Article Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {article.title}
        </h2>
        
        {/* Article Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Engagement Stats */}
        {/* Removed old stat line with 👁️, ❤️, 💬 */}

        {/* Minimal Action Row */}
        <div className="flex items-center space-x-6 mt-2">
          <button
            onClick={() => onLike(article.id)}
            disabled={isLiking}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 focus:outline-none"
            aria-label="Like"
          >
            <ThumbsUp className="w-6 h-6" strokeWidth={2} />
            <span className="text-sm">{article.likeCount.toLocaleString()}</span>
          </button>
          <div className="flex items-center space-x-1 text-gray-600">
            <MessageCircle className="w-6 h-6" strokeWidth={2} />
            <span className="text-sm">{article.commentCount.toLocaleString()}</span>
          </div>
          <button
            onClick={() => handleMinimalShare(article)}
            disabled={isSharing}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 focus:outline-none"
            aria-label="Share"
          >
            <Share2 className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={article.sourceUrl}
            onClick={handleExternalLink}
            className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Read Original Article
          </a>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onShare(article.id, 'twitter')}
                disabled={isSharing}
                className="p-2 text-gray-600 hover:text-blue-400 transition-colors disabled:opacity-50"
                title="Share on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button
                onClick={() => onShare(article.id, 'facebook')}
                disabled={isSharing}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Share on Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={() => onShare(article.id, 'linkedin')}
                disabled={isSharing}
                className="p-2 text-gray-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Disclaimer:</strong> This article is curated from external sources and is not written by Francis Bockarie. 
            All content belongs to their respective authors and publishers. Click "Read Original Article" to view the full content on the source website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CuratedArticleCard; 