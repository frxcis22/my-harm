import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Search, 
  FileText, 
  Clock, 
  Tag,
  Eye,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  // Mock data - in real app this would come from your backend
  const recentArticles = [
    {
      id: 1,
      title: "Advanced Phishing Detection Techniques",
      excerpt: "Exploring the latest methods to identify and prevent sophisticated phishing attacks...",
      tags: ["ThreatIntel", "Detection"],
      publishedAt: new Date('2024-01-15'),
      views: 1247,
      status: 'published'
    },
    {
      id: 2,
      title: "Vendor Risk Assessment Framework",
      excerpt: "A comprehensive guide to evaluating third-party security risks...",
      tags: ["VendorRisk", "Compliance"],
      publishedAt: new Date('2024-01-12'),
      views: 892,
      status: 'published'
    },
    {
      id: 3,
      title: "Zero-Day Exploit Analysis",
      excerpt: "Deep dive into recent zero-day vulnerabilities and mitigation strategies...",
      tags: ["ZeroDay", "Analysis"],
      publishedAt: new Date('2024-01-10'),
      views: 2156,
      status: 'published'
    }
  ];

  const stats = [
    { label: 'Total Posts', value: '24', icon: FileText, change: '+12%' },
    { label: 'Drafts', value: '3', icon: Clock, change: '2 new' },
    { label: 'Total Views', value: '15.2K', icon: Eye, change: '+8%' },
    { label: 'Top Tags', value: '8', icon: Tag, change: 'ThreatIntel' }
  ];

  const quickActions = [
    {
      title: 'New Article',
      description: 'Create a new blog post',
      icon: Plus,
      href: '/editor',
      color: 'bg-primary text-white'
    },
    {
      title: 'Upload Document',
      description: 'Add files to your library',
      icon: Upload,
      href: '/uploads',
      color: 'bg-green-500 text-white'
    },
    {
      title: 'Search Posts',
      description: 'Find specific content',
      icon: Search,
      href: '/articles',
      color: 'bg-blue-500 text-white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold font-heading mb-2">
          Welcome back, Francis 👋
        </h1>
        <p className="text-muted">
          Here's what's new in your cybersecurity journal.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${index === 0 ? 'bg-primary/10 text-primary' : 
                  index === 1 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                  index === 2 ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                  'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs text-muted mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="card p-4 hover:shadow-md transition-shadow group"
              >
                <div className={`inline-flex p-3 rounded-lg mb-3 ${action.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Articles</h2>
          <Link 
            to="/articles" 
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentArticles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{article.title}</h3>
                  <p className="text-sm text-muted mb-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(article.publishedAt, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-1">
                    {article.tags.map((tag) => (
                      <span key={tag} className="tag text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/editor/${article.id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/articles/${article.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 