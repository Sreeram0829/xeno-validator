import { apiService } from './api.js';

/**
 * Download Service
 * Handles file download API calls
 */
export const downloadService = {
  /**
   * Download cleaned CSV file
   */
  downloadCleanedFile: async (fileId, filename = null) => {
    try {
      const response = await apiService.download(`/download/cleaned/${fileId}`);
      const fileName = filename || `cleaned_${fileId}.csv`;
      downloadBlob(response.data, fileName, 'text/csv');
      return { success: true, filename: fileName };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(error.message || 'Failed to download cleaned file');
    }
  },

  /**
   * Download error report
   */
  downloadErrorReport: async (fileId, filename = null) => {
    try {
      const response = await apiService.download(`/download/errors/${fileId}`);
      const fileName = filename || `errors_${fileId}.csv`;
      downloadBlob(response.data, fileName, 'text/csv');
      return { success: true, filename: fileName };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(error.message || 'Failed to download error report');
    }
  },

  /**
   * Download specific chunk
   */
  downloadChunk: async (fileId, chunkIndex, filename = null) => {
    try {
      const response = await apiService.download(`/download/chunk/${fileId}/${chunkIndex}`);
      const fileName = filename || `chunk_${fileId}_${chunkIndex}.csv`;
      downloadBlob(response.data, fileName, 'text/csv');
      return { success: true, filename: fileName };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(error.message || `Failed to download chunk ${chunkIndex}`);
    }
  },

  /**
   * Download all chunks as zip
   */
  downloadAllChunks: async (fileId, filename = null) => {
    try {
      const response = await apiService.download(`/download/chunks/${fileId}`);
      const fileName = filename || `chunks_${fileId}.zip`;
      downloadBlob(response.data, fileName, 'application/zip');
      return { success: true, filename: fileName };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(error.message || 'Failed to download chunks');
    }
  },

  /**
   * Download summary report (JSON)
   */
  downloadSummary: async (fileId, filename = null) => {
    try {
      const response = await apiService.download(`/download/summary/${fileId}`);
      const fileName = filename || `summary_${fileId}.json`;
      downloadBlob(response.data, fileName, 'application/json');
      return { success: true, filename: fileName };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(error.message || 'Failed to download summary');
    }
  },

  /**
   * Download text report
   */
  downloadTextReport: async (fileId, filename = null) => {
    try {
      const response = await apiService.download(`/download/report/${fileId}`);
      const fileName = filename || `report_${fileId}.txt`;
      downloadBlob(response.data, fileName, 'text/plain');
      return { success: true, filename: fileName };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(error.message || 'Failed to download text report');
    }
  },

  /**
   * Get download URL for a file
   */
  getDownloadUrl: (fileId, type = 'cleaned', chunkIndex = null) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const urls = {
      cleaned: `/download/cleaned/${fileId}`,
      errors: `/download/errors/${fileId}`,
      summary: `/download/summary/${fileId}`,
      report: `/download/report/${fileId}`,
      chunks: `/download/chunks/${fileId}`,
      chunk: `/download/chunk/${fileId}/${chunkIndex}`
    };

    const path = urls[type] || urls.cleaned;
    return `${baseUrl}${path}`;
  }
};

/**
 * Helper function to download blob data
 */
const downloadBlob = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default downloadService;