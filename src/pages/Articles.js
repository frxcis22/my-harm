import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  List, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MoreVertical,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Articles = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        // Fetch user's articles
        const response = await userAPI.articles.getMyArticles();
        setArticles(response.articles || []);
      } else {
        // Fetch public articles
        const response = await userAPI.articles.getAll({ status: 'published' });
        setArticles(response.articles || []);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await userAPI.articles.delete(articleId);
      toast.success('Article deleted successfully');
      fetchArticles(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('Failed to delete article');
    }
  };

  const filters = [
    { id: 'all', label: 'All Posts', count: articles.length },
    { id: 'published', label: 'Published', count: articles.filter(a => a.status === 'published').length },
    { id: 'draft', label: 'Drafts', count: articles.filter(a => a.status === 'draft').length },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesFilter = selectedFilter === 'all' || article.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const ArticleCard = ({ article }) => (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted mb-3 line-clamp-3">{article.excerpt || 'No excerpt available'}</p>
        </div>
        <button className="p-1 hover:bg-muted rounded">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          {(article.tags || []).map((tag) => (
            <span key={tag} className="tag text-xs">
              #{tag}
            </span>
          ))}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          article.status === 'published' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
        }`}>
          {article.status}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted mb-4">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{(article.views || 0).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {isAuthenticated && (
          <Link
            to={`/editor/${article.id}`}
            className="btn btn-ghost btn-sm flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        )}
        <Link
          to={`/articles/${article.id}`}
          className="btn btn-primary btn-sm flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
        {isAuthenticated && (
          <button 
            className="btn btn-ghost btn-sm p-2 hover:text-red-600"
            onClick={() => handleDeleteArticle(article.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  const ArticleListItem = ({ article }) => (
    <div className="card p-4 hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold">{article.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              article.status === 'published' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
            }`}>
              {article.status}
            </span>
          </div>
          <p className="text-sm text-muted mb-2 line-clamp-1">{article.excerpt || 'No excerpt available'}</p>
          <div className="flex items-center space-x-4 text-xs text-muted">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{(article.views || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {(article.tags || []).map((tag) => (
              <span key={tag} className="tag text-xs">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Link
                to={`/editor/${article.id}`}
                className="btn btn-ghost btn-sm"
              >
                <Edit className="h-4 w-4" />
              </Link>
            )}
            <Link
              to={`/articles/${article.id}`}
              className="btn btn-primary btn-sm"
            >
              <Eye className="h-4 w-4" />
            </Link>
            {isAuthenticated && (
              <button 
                className="btn btn-ghost btn-sm p-2 hover:text-red-600"
                onClick={() => handleDeleteArticle(article.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="text-muted">
            {isAuthenticated ? 'Manage your cybersecurity articles and insights' : 'Browse cybersecurity articles and insights'}
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/editor/new"
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full input"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 border-b">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              selectedFilter === filter.id
                ? 'bg-primary text-white'
                : 'text-muted hover:text-foreground hover:bg-muted'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Articles Grid/List */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery || selectedFilter !== 'all' ? 'No articles found' : 'No articles yet'}
          </h3>
          <p className="text-muted mb-4">
            {searchQuery || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : isAuthenticated 
                ? 'Create your first article to get started'
                : 'Check back later for new articles'
            }
          </p>
          {isAuthenticated && !searchQuery && selectedFilter === 'all' && (
            <Link to="/editor/new" className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create First Article
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredArticles.map((article) => (
            viewMode === 'grid' ? (
              <ArticleCard key={article.id} article={article} />
            ) : (
              <ArticleListItem key={article.id} article={article} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles; 