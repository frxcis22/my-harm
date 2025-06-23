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

// User API (for authenticated users to manage their own content)
export const userAPI = {
  // Articles management
  articles: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/articles?${queryString}`);
    },

    getById: async (id) => {
      return apiRequest(`/articles/${id}`);
    },

    create: async (articleData) => {
      return apiRequest('/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
    },

    update: async (id, articleData) => {
      return apiRequest(`/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(articleData),
      });
    },

    delete: async (id) => {
      return apiRequest(`/articles/${id}`, {
        method: 'DELETE',
      });
    },

    getMyArticles: async () => {
      return apiRequest('/articles/my/articles');
    },
  },

  // Uploads management
  uploads: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/uploads?${queryString}`);
    },

    getById: async (id) => {
      return apiRequest(`/uploads/${id}`);
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

      const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        body: formData,
      });

      return handleResponse(response);
    },

    update: async (id, metadata) => {
      return apiRequest(`/uploads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(metadata),
      });
    },

    delete: async (id) => {
      return apiRequest(`/uploads/${id}`, {
        method: 'DELETE',
      });
    },

    download: async (id) => {
      const response = await fetch(`${API_BASE_URL}/uploads/download/${id}`);

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
      return apiRequest(`/categories?${queryString}`);
    },

    getById: async (id) => {
      return apiRequest(`/categories/${id}`);
    },

    create: async (categoryData) => {
      return apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    },

    update: async (id, categoryData) => {
      return apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    },

    delete: async (id) => {
      return apiRequest(`/categories/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // User profile management
  profile: {
    get: async () => {
      return apiRequest('/auth/profile');
    },

    update: async (profileData) => {
      return apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },

    changePassword: async (passwordData) => {
      return apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });
    },
  },
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  refreshToken: async () => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },
};

// Utility functions for API management
export const apiUtils = {
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  removeAuthToken: () => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

const api = {
  public: publicAPI,
  user: userAPI,
  auth: authAPI,
  utils: apiUtils,
};

export default api; 