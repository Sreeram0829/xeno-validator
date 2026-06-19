import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { uploadService } from '../services/uploadService.js';

/**
 * Custom hook for validation
 * Handles validation status, summary, and errors
 */
export const useValidation = () => {
  const { state, actions } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch validation summary
   */
  const fetchSummary = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return null;
    }

    console.log('🔍 Fetching summary for fileId:', fileId);

    setIsLoading(true);
    setError(null);

    try {
      // Get status from the upload status endpoint
      const statusData = await uploadService.getUploadStatus(fileId);
      console.log('📊 Status data received:', statusData);
      
      // Extract summary from the response
      let summaryData = null;
      
      // Check different possible response structures
      if (statusData) {
        // If statusData has a summary property
        if (statusData.summary) {
          summaryData = statusData.summary;
        } 
        // If statusData itself is the summary
        else if (statusData.total !== undefined) {
          summaryData = statusData;
        }
        // If statusData has data.summary
        else if (statusData.data && statusData.data.summary) {
          summaryData = statusData.data.summary;
        }
        // If statusData has data with total
        else if (statusData.data && statusData.data.total !== undefined) {
          summaryData = statusData.data;
        }
      }
      
      console.log('📊 Extracted summary data:', summaryData);
      
      if (summaryData) {
        const formattedSummary = {
          total: summaryData.total || 0,
          valid: summaryData.valid || 0,
          invalid: summaryData.invalid || 0,
          errorRate: summaryData.errorRate || 0
        };
        
        console.log('📊 Formatted summary:', formattedSummary);
        
        // Set validation summary in context
        actions.setValidationSummary(formattedSummary);
        if (actions.setProcessed) {
          actions.setProcessed(true);
        }
        setIsLoading(false);
        return formattedSummary;
      } else {
        console.warn('⚠️ No summary data found in response');
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      console.error('❌ Fetch summary error:', error);
      setError(error.message || 'Failed to fetch summary');
      setIsLoading(false);
      return null;
    }
  }, [actions]);

  /**
   * Fetch validation errors
   */
  const fetchErrors = useCallback(async (fileId) => {
    if (!fileId) {
      setError('File ID is required');
      return null;
    }

    console.log('🔍 Fetching errors for fileId:', fileId);

    setIsLoading(true);
    setError(null);

    try {
      const statusData = await uploadService.getUploadStatus(fileId);
      console.log('📊 Error response:', statusData);
      
      let errorsData = null;
      
      if (statusData && statusData.errors) {
        errorsData = statusData.errors;
      } else if (statusData && statusData.data && statusData.data.errors) {
        errorsData = statusData.data.errors;
      }
      
      if (errorsData) {
        actions.setValidationErrors(errorsData);
        setIsLoading(false);
        return errorsData;
      }
      
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error('❌ Fetch errors error:', error);
      setError(error.message || 'Failed to fetch errors');
      setIsLoading(false);
      return null;
    }
  }, [actions]);

  /**
   * Get validation statistics
   */
  const getStats = useCallback(() => {
    const summary = state.validationSummary;
    if (!summary) return null;

    const total = summary.total || 0;
    const valid = summary.valid || 0;
    const invalid = summary.invalid || 0;

    return {
      total,
      valid,
      invalid,
      successRate: total > 0 ? (valid / total * 100) : 0,
      errorRate: total > 0 ? (invalid / total * 100) : 0,
      status: invalid === 0 ? 'success' : (valid === 0 ? 'failed' : 'partial')
    };
  }, [state.validationSummary]);

  /**
   * Clear validation data
   */
  const clearValidation = useCallback(() => {
    actions.setValidationSummary(null);
    actions.setValidationErrors(null);
    if (actions.setProcessed) {
      actions.setProcessed(false);
    }
    setError(null);
  }, [actions]);

  return {
    // State
    fileId: state.fileId,
    summary: state.validationSummary,
    errors: state.validationErrors,
    isProcessed: state.isProcessed,
    isLoading,
    error,

    // Statistics
    stats: getStats(),
    totalRows: state.totalRows,
    validCount: state.validCount,
    errorCount: state.errorCount,

    // Actions
    fetchSummary,
    fetchErrors,
    clearValidation,

    // Helpers
    hasSummary: !!state.validationSummary,
    hasErrors: !!state.validationErrors && state.validationErrors.length > 0,
    isComplete: state.isProcessed
  };
};

export default useValidation;