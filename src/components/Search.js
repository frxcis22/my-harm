import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Filter, X, Clock, Tag, User, Calendar } from 'lucide-react';
import { sanitizeSearchQuery, logSecurityEvent } from '../utils/security';
import { useDebounce } from '../hooks/useDebounce';

const Search = ({ articles = [], onSearch, placeholder = "Search articles..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    tags: [],
    author: '',
    dateRange: ''
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  // Extract unique categories and tags from articles
  const categories = [...new Set(articles.map(article => article.category).filter(Boolean))];
  const allTags = articles.flatMap(article => article.tags || []).filter(Boolean);
  const uniqueTags = [...new Set(allTags)];
  const authors = [...new Set(articles.map(article => article.author).filter(Boolean))];

  // Security: Sanitize search query
  const handleQueryChange = (e) => {
    const sanitizedQuery = sanitizeSearchQuery(e.target.value);
    setQuery(sanitizedQuery);
    
    // Log search activity for security monitoring
    if (sanitizedQuery.length > 3) {
      logSecurityEvent('search_query', { 
        query: sanitizedQuery, 
        length: sanitizedQuery.length 
      });
    }
  };

  // Perform search with security measures
  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim() && !Object.values(filters).some(v => v && v.length > 0)) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let filteredResults = articles;

      // Apply text search
      if (debouncedQuery.trim()) {
        const searchTerms = debouncedQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        
        filteredResults = filteredResults.filter(article => {
          const searchableText = [
            article.title,
            article.excerpt,
            article.content,
            article.category,
            ...(article.tags || [])
          ].join(' ').toLowerCase();
          
          return searchTerms.every(term => searchableText.includes(term));
        });
      }

      // Apply filters
      if (filters.category) {
        filteredResults = filteredResults.filter(article => 
          article.category === filters.category
        );
      }

      if (filters.tags.length > 0) {
        filteredResults = filteredResults.filter(article =>
          filters.tags.some(tag => article.tags?.includes(tag))
        );
      }

      if (filters.author) {
        filteredResults = filteredResults.filter(article =>
          article.author === filters.author
        );
      }

      if (filters.dateRange) {
        const now = new Date();
        const daysAgo = parseInt(filters.dateRange);
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        filteredResults = filteredResults.filter(article => {
          const articleDate = new Date(article.publishedAt || article.createdAt);
          return articleDate >= cutoffDate;
        });
      }

      setResults(filteredResults);
      setIsOpen(true);
      
      // Call parent callback
      if (onSearch) {
        onSearch(filteredResults, debouncedQuery, filters);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      logSecurityEvent('search_error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, filters, articles, onSearch]);

  // Perform search when query or filters change
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({
      category: '',
      tags: [],
      author: '',
      dateRange: ''
    });
    setResults([]);
    setIsOpen(false);
  };

  const toggleTag = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="search-container relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          maxLength={100}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-2 p-1 rounded-md transition-colors ${
              showFilters || Object.values(filters).some(v => v && v.length > 0)
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <select
                value={filters.author}
                onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Time</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: '', tags: [], author: '', dateRange: '' })}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {uniqueTags.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((article) => (
                <div
                  key={article.id}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/articles/${article.id}`;
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{calculateReadingTime(article.content)} min read</span>
                        </div>
                        {article.category && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>{article.category}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <SearchIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p>No results found</p>
              <p className="text-sm">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 