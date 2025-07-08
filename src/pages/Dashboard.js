import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Tag,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Upload,
  Search,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import AdminAccessLog from '../components/AdminAccessLog';
import SubscriptionManager from '../components/SubscriptionManager';

const Dashboard = () => {
  const [isAdmin] = useState(true); // Francis Bockarie is always admin
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from your backend
  const recentArticles = useMemo(() => [
    {
      id: 1,
      title: "Advanced Phishing Detection Techniques",
      excerpt: "Exploring the latest methods to identify and prevent sophisticated phishing attacks...",
      tags: ["ThreatIntel", "Detection"],
      publishedAt: new Date('2024-01-15'),
      views: 1247,
      likes: 89,
      comments: 12,
      status: 'published'
    },
    {
      id: 2,
      title: "Vendor Risk Assessment Framework",
      excerpt: "A comprehensive guide to evaluating third-party security risks...",
      tags: ["VendorRisk", "Compliance"],
      publishedAt: new Date('2024-01-12'),
      views: 892,
      likes: 67,
      comments: 8,
      status: 'published'
    },
    {
      id: 3,
      title: "Zero-Day Exploit Analysis",
      excerpt: "Deep dive into recent zero-day vulnerabilities and mitigation strategies...",
      tags: ["ZeroDay", "Analysis"],
      publishedAt: new Date('2024-01-10'),
      views: 2156,
      likes: 156,
      comments: 23,
      status: 'published'
    }
  ], []);

  const stats = [
    { label: 'Total Posts', value: '24', icon: FileText, change: '+12%', color: 'bg-blue-100 text-blue-600' },
    { label: 'Drafts', value: '3', icon: Clock, change: '2 new', color: 'bg-orange-100 text-orange-600' },
    { label: 'Total Views', value: '15.2K', icon: Eye, change: '+8%', color: 'bg-green-100 text-green-600' },
    { label: 'Top Tags', value: '8', icon: Tag, change: 'ThreatIntel', color: 'bg-purple-100 text-purple-600' }
  ];

  const engagementStats = [
    { label: 'Total Likes', value: '1.2K', icon: Heart, change: '+15%', color: 'bg-red-100 text-red-600' },
    { label: 'Total Comments', value: '156', icon: MessageCircle, change: '+12%', color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Total Shares', value: '89', icon: Share2, change: '+23%', color: 'bg-teal-100 text-teal-600' },
    { label: 'Avg. Engagement', value: '4.2%', icon: TrendingUp, change: '+5%', color: 'bg-yellow-100 text-yellow-600' }
  ];

  const quickActions = [
    {
      title: 'New Article',
      description: 'Create a new blog post',
      icon: Plus,
      href: '/editor',
      color: 'bg-blue-600 text-white'
    },
    {
      title: 'Upload Document',
      description: 'Add files to your library',
      icon: Upload,
      href: '/uploads',
      color: 'bg-green-600 text-white'
    },
    {
      title: 'Search Posts',
      description: 'Find specific content',
      icon: Search,
      href: '/articles',
      color: 'bg-purple-600 text-white'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setArticles(recentArticles);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [recentArticles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">This dashboard is only available to Francis Bockarie.</p>
          <Link 
            to="/articles"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Public Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold font-heading mb-2">
          Dashboard - Francis Bockarie
        </h1>
        <p className="text-muted">
          Here's what's new in your cybersecurity journal.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            🔐 <strong>Admin View:</strong> You have full access to manage your cybersecurity blog.
          </p>
        </div>
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
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs text-muted mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Engagement Stats */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Reader Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engagementStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>
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
          {articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {article.status}
                    </span>
                    <span className="text-xs text-muted">
                      {format(article.publishedAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{article.title}</h3>
                  <p className="text-sm text-muted mb-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{article.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{article.comments} comments</span>
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

      {/* Admin Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Admin Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Francis Bockarie</h3>
            <p className="text-sm text-muted mb-3">
              IT Security Professional and Cybersecurity Expert
            </p>
            <p className="text-sm text-gray-600">
              You have full administrative access to manage your cybersecurity blog, 
              create content, and monitor reader engagement.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 24 published articles</li>
              <li>• 3 drafts in progress</li>
              <li>• 15.2K total views</li>
              <li>• 1.2K total likes</li>
              <li>• 156 total comments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Access Log */}
      <div className="card p-6">
        <AdminAccessLog />
      </div>

      {/* Email Subscription Manager */}
      <div className="card p-6">
        <SubscriptionManager />
      </div>
    </div>
  );
};

export default Dashboard; 