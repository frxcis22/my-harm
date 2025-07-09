// Import mock data
import { mockAPIResponses } from './mockData';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed, using mock data:', error);
    // Return mock data when backend is not available
    return getMockResponse(endpoint, options);
  }
};

// Helper function to get mock responses
const getMockResponse = (endpoint, options = {}) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes('/public/articles') && !endpoint.includes('/comments') && !endpoint.includes('/like') && !endpoint.includes('/share')) {
        resolve(mockAPIResponses.articles);
      } else if (endpoint.includes('/comments')) {
        resolve(mockAPIResponses.comments);
      } else if (endpoint.includes('/like')) {
        resolve({ likeCount: Math.floor(Math.random() * 1000) + 500 });
      } else if (endpoint.includes('/share')) {
        resolve({ success: true, message: 'Article shared successfully' });
      } else {
        resolve({ success: true, message: 'Mock response' });
      }
    }, 500); // Simulate 500ms delay
  });
};

// API utilities
export const apiUtils = {
  isAuthenticated: () => true, // Always authenticated in public mode
  setAuthToken: () => {}, // No-op in public mode
  removeAuthToken: () => {}, // No-op in public mode
  getAuthToken: () => 'public-mode', // Return dummy token
};

// Articles API
export const articlesAPI = {
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

  getStats: async () => {
    return apiRequest('/articles/stats/overview');
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest('/categories');
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
};

// Uploads API
export const uploadsAPI = {
  upload: async (formData) => {
    return apiRequest('/uploads', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },

  getAll: async () => {
    return apiRequest('/uploads');
  },

  getById: async (id) => {
    return apiRequest(`/uploads/${id}`);
  },

  delete: async (id) => {
    return apiRequest(`/uploads/${id}`, {
      method: 'DELETE',
    });
  },
};

// Public API
export const publicAPI = {
  getArticles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/public/articles?${queryString}`);
  },

  getFeaturedArticles: async () => {
    return apiRequest('/public/articles/featured');
  },

  getCuratedArticles: async () => {
    return apiRequest('/public/articles/curated');
  },

  searchRealTimeArticles: async (query, filters = {}) => {
    return apiRequest('/public/articles/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters })
    });
  },

  getArticle: async (id) => {
    return apiRequest(`/public/articles/${id}`);
  },

  getCuratedArticle: async (id) => {
    return apiRequest(`/public/articles/${id}`);
  },

  getComments: async (articleId) => {
    return apiRequest(`/public/articles/${articleId}/comments`);
  },

  addComment: async (articleId, commentData) => {
    return apiRequest(`/public/articles/${articleId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  likeArticle: async (articleId, visitorId) => {
    return apiRequest(`/public/articles/${articleId}/like`, {
      method: 'POST',
      body: JSON.stringify({ visitorId })
    });
  },

  shareArticle: async (articleId, shareData) => {
    return apiRequest(`/public/articles/${articleId}/share`, {
      method: 'POST',
      body: JSON.stringify(shareData),
    });
  },

  getArticleEngagement: async (articleId) => {
    return apiRequest(`/public/articles/${articleId}/engagement`);
  },

  sendMessage: async (messageData) => {
    return apiRequest('/public/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getPreferences: async () => {
    return apiRequest('/users/preferences');
  },

  updatePreferences: async (preferences) => {
    return apiRequest('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  },
};

// Authentication API (simplified for public mode)
export const authAPI = {
  sendCode: async (email) => {
    return { message: 'Public mode - no authentication required' };
  },

  verify: async (email, code) => {
    return { 
      message: 'Public mode - no authentication required',
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Francis Bockarie',
        email: 'francis@cyberscroll.com',
        role: 'admin'
      },
      token: 'public-mode'
    };
  },

  logout: async () => {
    return { message: 'Public mode - logout disabled' };
  },

  getProfile: async () => {
    return {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Francis Bockarie',
        email: 'francis@cyberscroll.com',
        role: 'admin'
      }
    };
  },

  updateProfile: async (profileData) => {
    throw new Error('Profile updates not available in public mode');
  },

  refreshToken: async () => {
    return { token: 'public-mode' };
  },
};

// Backward compatibility - export a simple api object
export const api = {
  ...articlesAPI,
  ...publicAPI,
  ...userAPI,
  ...authAPI,
  ...categoriesAPI,
  ...uploadsAPI,
  ...apiUtils,
};