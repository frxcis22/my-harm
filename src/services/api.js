const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

// Public API (for visitors)
export const publicAPI = {
  // Get all published articles
  getArticles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/public/articles?${queryString}`);
  },

  // Get single article by ID
  getArticle: async (id) => {
    return apiRequest(`/public/articles/${id}`);
  },

  // Get article comments
  getComments: async (articleId) => {
    return apiRequest(`/public/articles/${articleId}/comments`);
  },

  // Add comment (no auth required)
  addComment: async (articleId, commentData) => {
    return apiRequest(`/public/articles/${articleId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // Like/unlike article
  toggleLike: async (articleId, visitorId) => {
    return apiRequest(`/public/articles/${articleId}/like`, {
      method: 'POST',
      body: JSON.stringify({ visitorId }),
    });
  },

  // Get article likes count
  getLikes: async (articleId) => {
    return apiRequest(`/public/articles/${articleId}/likes`);
  },

  // Get categories
  getCategories: async () => {
    return apiRequest('/public/categories');
  },

  // Search articles
  searchArticles: async (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    return apiRequest(`/public/search?${searchParams}`);
  },

  // Get blog stats
  getStats: async () => {
    return apiRequest('/public/stats');
  },

  // Contact form
  sendMessage: async (messageData) => {
    return apiRequest('/public/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// Admin API (for you only - requires authentication)
export const adminAPI = {
  // Articles management
  articles: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/admin/articles?${queryString}`);
    },

    getById: async (id) => {
      return apiRequest(`/admin/articles/${id}`);
    },

    create: async (articleData) => {
      return apiRequest('/admin/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
    },

    update: async (id, articleData) => {
      return apiRequest(`/admin/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(articleData),
      });
    },

    delete: async (id) => {
      return apiRequest(`/admin/articles/${id}`, {
        method: 'DELETE',
      });
    },

    publish: async (id) => {
      return apiRequest(`/admin/articles/${id}/publish`, {
        method: 'POST',
      });
    },

    unpublish: async (id) => {
      return apiRequest(`/admin/articles/${id}/unpublish`, {
        method: 'POST',
      });
    },

    getStats: async () => {
      return apiRequest('/admin/articles/stats');
    },
  },

  // Comments management
  comments: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/admin/comments?${queryString}`);
    },

    approve: async (id) => {
      return apiRequest(`/admin/comments/${id}/approve`, {
        method: 'POST',
      });
    },

    reject: async (id) => {
      return apiRequest(`/admin/comments/${id}/reject`, {
        method: 'POST',
      });
    },

    delete: async (id) => {
      return apiRequest(`/admin/comments/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Messages management
  messages: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/admin/messages?${queryString}`);
    },

    markRead: async (id) => {
      return apiRequest(`/admin/messages/${id}/read`, {
        method: 'POST',
      });
    },

    delete: async (id) => {
      return apiRequest(`/admin/messages/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Uploads management
  uploads: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/admin/uploads?${queryString}`);
    },

    getById: async (id) => {
      return apiRequest(`/admin/uploads/${id}`);
    },

    upload: async (files, metadata = {}) => {
      const formData = new FormData();
      
      if (Array.isArray(files)) {
        files.forEach(file => {
          formData.append('files', file);
        });
      } else {
        formData.append('files', files);
      }

      Object.keys(metadata).forEach(key => {
        if (metadata[key] !== undefined && metadata[key] !== null) {
          formData.append(key, typeof metadata[key] === 'object' 
            ? JSON.stringify(metadata[key]) 
            : metadata[key]
          );
        }
      });

      const response = await fetch(`${API_BASE_URL}/admin/uploads`, {
        method: 'POST',
        body: formData,
      });

      return handleResponse(response);
    },

    update: async (id, metadata) => {
      return apiRequest(`/admin/uploads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(metadata),
      });
    },

    delete: async (id) => {
      return apiRequest(`/admin/uploads/${id}`, {
        method: 'DELETE',
      });
    },

    download: async (id) => {
      const response = await fetch(`${API_BASE_URL}/admin/uploads/download/${id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.blob();
    },
  },

  // Categories management
  categories: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/admin/categories?${queryString}`);
    },

    getById: async (id) => {
      return apiRequest(`/admin/categories/${id}`);
    },

    create: async (categoryData) => {
      return apiRequest('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    },

    update: async (id, categoryData) => {
      return apiRequest(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    },

    delete: async (id) => {
      return apiRequest(`/admin/categories/${id}`, {
        method: 'DELETE',
      });
    },

    getStats: async () => {
      return apiRequest('/admin/categories/stats/overview');
    },

    getPopular: async (limit = 10) => {
      return apiRequest(`/admin/categories/popular?limit=${limit}`);
    },

    merge: async (sourceId, targetId) => {
      return apiRequest('/admin/categories/merge', {
        method: 'POST',
        body: JSON.stringify({ sourceId, targetId }),
      });
    },
  },

  // Settings management
  settings: {
    getPreferences: async () => {
      return apiRequest('/admin/settings');
    },

    updatePreferences: async (preferences) => {
      return apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
    },

    exportData: async (exportOptions = {}) => {
      return apiRequest('/admin/export', {
        method: 'POST',
        body: JSON.stringify(exportOptions),
      });
    },

    importData: async (importData) => {
      return apiRequest('/admin/import', {
        method: 'POST',
        body: JSON.stringify({ importData }),
      });
    },
  },
};

const api = {
  public: publicAPI,
  admin: adminAPI,
};

export default api; 