import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data
      });
      
      switch (error.response.status) {
        case 400:
          error.message = error.response.data?.message || 'Bad request';
          break;
        case 404:
          error.message = 'Resource not found';
          break;
        case 413:
          error.message = 'File too large. Please upload a smaller file.';
          break;
        case 500:
          error.message = 'Internal server error. Please try again later.';
          break;
        default:
          error.message = error.response.data?.message || 'An error occurred';
      }
    } else if (error.request) {
      error.message = 'No response from server. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// API service with common methods
export const apiService = {
  /**
   * GET request
   */
  get: (url, params = {}) => {
    return api.get(url, { params });
  },

  /**
   * POST request
   */
  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config);
  },

  /**
   * PUT request
   */
  put: (url, data = {}) => {
    return api.put(url, data);
  },

  /**
   * DELETE request
   */
  delete: (url, params = {}) => {
    return api.delete(url, { params });
  },

  /**
   * File upload (multipart/form-data)
   */
  upload: (url, formData, onProgress = null) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
  },

  /**
   * File download (blob)
   */
  download: (url, params = {}) => {
    return api.get(url, {
      params,
      responseType: 'blob'
    });
  }
};

// Default export for api
export default api;