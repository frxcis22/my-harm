import React, { useState } from 'react';
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

const Articles = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data
  const articles = [
    {
      id: 1,
      title: "Advanced Phishing Detection Techniques",
      excerpt: "Exploring the latest methods to identify and prevent sophisticated phishing attacks that target enterprise environments...",
      tags: ["ThreatIntel", "Detection"],
      publishedAt: new Date('2024-01-15'),
      views: 1247,
      status: 'published',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: "Vendor Risk Assessment Framework",
      excerpt: "A comprehensive guide to evaluating third-party security risks and implementing effective vendor management strategies...",
      tags: ["VendorRisk", "Compliance"],
      publishedAt: new Date('2024-01-12'),
      views: 892,
      status: 'published',
      readTime: '12 min read'
    },
    {
      id: 3,
      title: "Zero-Day Exploit Analysis",
      excerpt: "Deep dive into recent zero-day vulnerabilities and mitigation strategies for critical infrastructure protection...",
      tags: ["ZeroDay", "Analysis"],
      publishedAt: new Date('2024-01-10'),
      views: 2156,
      status: 'published',
      readTime: '15 min read'
    },
    {
      id: 4,
      title: "Cloud Security Best Practices",
      excerpt: "Essential security measures for protecting cloud infrastructure and applications in multi-cloud environments...",
      tags: ["CloudSec", "BestPractices"],
      publishedAt: new Date('2024-01-08'),
      views: 1567,
      status: 'draft',
      readTime: '10 min read'
    },
    {
      id: 5,
      title: "Incident Response Playbook",
      excerpt: "Step-by-step procedures for handling cybersecurity incidents and minimizing business impact...",
      tags: ["IncidentResponse", "Playbook"],
      publishedAt: new Date('2024-01-05'),
      views: 2034,
      status: 'published',
      readTime: '20 min read'
    },
    {
      id: 6,
      title: "Penetration Testing Methodology",
      excerpt: "Comprehensive approach to conducting effective penetration tests and vulnerability assessments...",
      tags: ["PenTesting", "Methodology"],
      publishedAt: new Date('2024-01-03'),
      views: 1789,
      status: 'published',
      readTime: '18 min read'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Posts', count: articles.length },
    { id: 'published', label: 'Published', count: articles.filter(a => a.status === 'published').length },
    { id: 'draft', label: 'Drafts', count: articles.filter(a => a.status === 'draft').length },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || article.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const ArticleCard = ({ article }) => (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted mb-3 line-clamp-3">{article.excerpt}</p>
        </div>
        <button className="p-1 hover:bg-muted rounded">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          {article.tags.map((tag) => (
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
          <span>{format(article.publishedAt, 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{article.views.toLocaleString()}</span>
        </div>
        <span>{article.readTime}</span>
      </div>
      
      <div className="flex space-x-2">
        <Link
          to={`/editor/${article.id}`}
          className="btn btn-ghost btn-sm flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Link>
        <Link
          to={`/articles/${article.id}`}
          className="btn btn-primary btn-sm flex-1"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
        <button className="btn btn-ghost btn-sm p-2 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </button>
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
          <p className="text-sm text-muted mb-2 line-clamp-1">{article.excerpt}</p>
          <div className="flex items-center space-x-4 text-xs text-muted">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(article.publishedAt, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{article.views.toLocaleString()}</span>
            </div>
            <span>{article.readTime}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {article.tags.map((tag) => (
              <span key={tag} className="tag text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-1">
            <Link
              to={`/editor/${article.id}`}
              className="btn btn-ghost btn-sm"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <Link
              to={`/articles/${article.id}`}
              className="btn btn-primary btn-sm"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button className="btn btn-ghost btn-sm hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">My Articles</h1>
          <p className="text-muted">Manage and organize your cybersecurity content</p>
        </div>
        <Link to="/editor" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted hover:text-foreground'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex border rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <ArticleListItem key={article.id} article={article} />
          ))}
        </div>
      )}

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-muted mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first article'}
          </p>
          {!searchQuery && (
            <Link to="/editor" className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Articles; 