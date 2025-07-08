import React from 'react';
import { ExternalLink, Clock, User, TrendingUp, Shield } from 'lucide-react';

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
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>👁️ {article.viewCount.toLocaleString()}</span>
            <span>❤️ {article.likeCount.toLocaleString()}</span>
            <span>💬 {article.commentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span className="text-xs">
              {Math.round(article.relevanceScore * 100)}% relevant
            </span>
          </div>
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

          <div className="flex space-x-2">
            <button
              onClick={() => onLike(article.id)}
              disabled={isLiking}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLiking ? '❤️' : '🤍'} Like
            </button>
            
            <button
              onClick={() => onShare(article.id, 'twitter')}
              disabled={isSharing}
              className="flex-1 bg-blue-400 text-white py-2 px-3 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 text-sm"
            >
              🐦 Share
            </button>
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