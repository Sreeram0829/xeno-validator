import { apiService } from './api.js';

/**
 * Upload Service
 * Handles file upload and validation API calls
 */
export const uploadService = {
  /**
   * Upload CSV file for validation
   */
  uploadFile: async (file, country = 'IN', onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('country', country);

    try {
      const response = await apiService.upload('/upload', formData, onProgress);
      console.log('📤 Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'File upload failed');
    }
  },

  /**
   * Validate file format before upload
   */
  validateFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.upload('/upload/validate', formData);
      return response.data;
    } catch (error) {
      console.error('Validation error:', error);
      throw new Error(error.message || 'File validation failed');
    }
  },

  /**
   * Get upload status - FIXED to handle the response correctly
   */
  getUploadStatus: async (fileId) => {
    try {
      console.log('📊 Fetching status for fileId:', fileId);
      const response = await apiService.get(`/upload/status/${fileId}`);
      console.log('📊 Status API full response:', response);
      console.log('📊 Status API data:', response.data);
      
      // The response might be wrapped in data.data
      const result = response.data?.data || response.data;
      console.log('📊 Result:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Get status error:', error);
      throw new Error(error.message || 'Failed to get upload status');
    }
  },

  /**
   * Delete uploaded file
   */
  deleteFile: async (fileId) => {
    try {
      const response = await apiService.delete(`/upload/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete file');
    }
  },

  /**
   * Check if file is valid CSV
   */
  checkFile: (file) => {
    const errors = [];
    let isValid = true;

    if (!file) {
      return { isValid: false, errors: ['No file selected'] };
    }

    const validTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      errors.push('File must be a CSV file');
      isValid = false;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'csv') {
      errors.push('File must have .csv extension');
      isValid = false;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File size exceeds 100MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      isValid = false;
    }

    if (file.size === 0) {
      errors.push('File is empty');
      isValid = false;
    }

    return { isValid, errors };
  }
};

export default uploadService;