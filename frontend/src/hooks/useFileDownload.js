import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { downloadService } from '../services/downloadService.js';

/**
 * Custom hook for file download
 * Handles downloading various file types with progress tracking
 */
export const useFileDownload = () => {
  const { state, actions } = useAppContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Download cleaned file
   */
  const downloadCleaned = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return false;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await downloadService.downloadCleanedFile(fileId);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);
      
      actions.setSuccess(`Cleaned file downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
      return false;
    }
  }, [actions]);

  /**
   * Download error report
   */
  const downloadErrors = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return false;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await downloadService.downloadErrorReport(fileId);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);
      
      actions.setSuccess(`Error report downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
      return false;
    }
  }, [actions]);

  /**
   * Download specific chunk
   */
  const downloadChunk = useCallback(async (chunkIndex, fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return false;
    }

    if (chunkIndex === undefined || chunkIndex === null) {
      setError('Chunk index is required');
      return false;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await downloadService.downloadChunk(fileId, chunkIndex);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);
      
      actions.setSuccess(`Chunk ${chunkIndex} downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
      return false;
    }
  }, [actions]);

  /**
   * Download all chunks as zip
   */
  const downloadAllChunks = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return false;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await downloadService.downloadAllChunks(fileId);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);
      
      actions.setSuccess(`All chunks downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
      return false;
    }
  }, [actions]);

  /**
   * Download summary
   */
  const downloadSummary = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return false;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await downloadService.downloadSummary(fileId);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);
      
      actions.setSuccess(`Summary downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
      return false;
    }
  }, [actions]);

  /**
   * Download text report
   */
  const downloadReport = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return false;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await downloadService.downloadTextReport(fileId);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);
      
      actions.setSuccess(`Report downloaded successfully`);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Download failed');
      setIsDownloading(false);
      setDownloadProgress(0);
      return false;
    }
  }, [actions]);

  /**
   * Get download URL
   */
  const getDownloadUrl = useCallback((type = 'cleaned', fileId, chunkIndex = null) => {
    return downloadService.getDownloadUrl(fileId, type, chunkIndex);
  }, []);

  /**
   * Reset download state
   */
  const reset = useCallback(() => {
    setIsDownloading(false);
    setDownloadProgress(0);
    setError(null);
  }, []);

  return {
    // State
    isDownloading,
    downloadProgress,
    error,
    
    // Actions
    downloadCleaned,
    downloadErrors,
    downloadChunk,
    downloadAllChunks,
    downloadSummary,
    downloadReport,
    getDownloadUrl,
    reset,
    
    // Helpers
    isError: !!error,
    isComplete: downloadProgress === 100
  };
};

export default useFileDownload;