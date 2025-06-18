import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Hash,
  FileText,
  TrendingUp
} from 'lucide-react';

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const categories = [
    {
      id: 1,
      name: 'ThreatIntel',
      count: 8,
      color: '#ef4444',
      description: 'Threat intelligence and analysis',
      lastUsed: new Date('2024-01-15'),
      trend: '+12%'
    },
    {
      id: 2,
      name: 'VendorRisk',
      count: 5,
      color: '#3b82f6',
      description: 'Third-party vendor risk management',
      lastUsed: new Date('2024-01-12'),
      trend: '+8%'
    },
    {
      id: 3,
      name: 'Detection',
      count: 6,
      color: '#10b981',
      description: 'Security detection and monitoring',
      lastUsed: new Date('2024-01-10'),
      trend: '+15%'
    },
    {
      id: 4,
      name: 'Compliance',
      count: 4,
      color: '#f59e0b',
      description: 'Regulatory compliance and governance',
      lastUsed: new Date('2024-01-08'),
      trend: '+5%'
    },
    {
      id: 5,
      name: 'ZeroDay',
      count: 3,
      color: '#8b5cf6',
      description: 'Zero-day vulnerability research',
      lastUsed: new Date('2024-01-05'),
      trend: '+20%'
    },
    {
      id: 6,
      name: 'IncidentResponse',
      count: 4,
      color: '#ec4899',
      description: 'Security incident response procedures',
      lastUsed: new Date('2024-01-03'),
      trend: '+10%'
    },
    {
      id: 7,
      name: 'CloudSec',
      count: 3,
      color: '#06b6d4',
      description: 'Cloud security best practices',
      lastUsed: new Date('2024-01-01'),
      trend: '+18%'
    },
    {
      id: 8,
      name: 'PenTesting',
      count: 2,
      color: '#84cc16',
      description: 'Penetration testing methodologies',
      lastUsed: new Date('2023-12-28'),
      trend: '+25%'
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (category) => {
    setEditingTag(category);
    setNewTagName(category.name);
  };

  const handleSave = () => {
    if (newTagName.trim()) {
      // Update logic here
      setEditingTag(null);
      setNewTagName('');
    }
  };

  const handleCancel = () => {
    setEditingTag(null);
    setNewTagName('');
  };

  const handleAdd = () => {
    if (newTagName.trim()) {
      // Add logic here
      setShowAddForm(false);
      setNewTagName('');
    }
  };

  const getTagColor = (color) => {
    return {
      backgroundColor: color + '20',
      color: color,
      borderColor: color + '40'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Categories</h1>
          <p className="text-muted">Organize your content with tags and categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add New Category Form */}
      {showAddForm && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="input"
                placeholder="Enter category name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                className="input"
                placeholder="Brief description..."
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleAdd}
              className="btn btn-primary"
            >
              Add Category
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={getTagColor(category.color)}
                >
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">#{category.name}</h3>
                  <p className="text-sm text-muted">{category.description}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-muted rounded hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Edit Mode */}
            {editingTag?.id === category.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="input"
                  placeholder="Category name..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn btn-primary btn-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <FileText className="h-4 w-4 text-muted" />
                      <span className="text-lg font-bold">{category.count}</span>
                    </div>
                    <p className="text-xs text-muted">Articles</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {category.trend}
                      </span>
                    </div>
                    <p className="text-xs text-muted">Growth</p>
                  </div>
                </div>

                {/* Last Used */}
                <div className="text-xs text-muted">
                  Last used: {category.lastUsed.toLocaleDateString()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first category to organize content'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Category Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {categories.length}
            </div>
            <p className="text-sm text-muted">Total Categories</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </div>
            <p className="text-sm text-muted">Total Articles</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(categories.reduce((sum, cat) => sum + cat.count, 0) / categories.length)}
            </div>
            <p className="text-sm text-muted">Avg Articles per Category</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 