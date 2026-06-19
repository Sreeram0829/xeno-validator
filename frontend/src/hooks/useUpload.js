import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { uploadService } from '../services/uploadService.js';
import { formatFileSize } from '../utils/formatters.js';

/**
 * Custom hook for file upload
 * Handles file selection, validation, and upload
 */
export const useUpload = () => {
  const { state, actions } = useAppContext();
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [uploadedFileId, setUploadedFileId] = useState(null);

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file) => {
    const errors = [];
    setIsValidating(true);
    setValidationErrors([]);

    if (!file) {
      errors.push('No file selected');
      setIsValidating(false);
      return { isValid: false, errors };
    }

    const validTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      errors.push('File must be a CSV file');
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'csv') {
      errors.push('File must have .csv extension');
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File size exceeds 100MB limit (${formatFileSize(file.size)})`);
    }

    if (file.size === 0) {
      errors.push('File is empty');
    }

    setIsValidating(false);
    setValidationErrors(errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((file) => {
    const validation = validateFile(file);
    
    if (validation.isValid) {
      actions.setFile(file);
      actions.clearError();
      actions.setSuccess(`File "${file.name}" selected successfully`);
      setUploadedFileId(null); // Reset fileId when new file is selected
    } else {
      actions.setError(validation.errors.join(', '));
    }

    return validation;
  }, [validateFile, actions]);

  /**
   * Upload file
   */
  const uploadFile = useCallback(async () => {
    if (!state.file) {
      actions.setError('No file selected');
      return null;
    }

    try {
      actions.startUpload();
      actions.clearError();

      const response = await uploadService.uploadFile(
        state.file,
        state.selectedCountry,
        (progress) => {
          actions.setUploadProgress(progress);
        }
      );

      if (response && response.success) {
        const fileId = response.data?.fileId || response.fileId;
        
        actions.uploadComplete({
          fileId: fileId,
          downloadLinks: response.data?.downloadLinks || response.downloadLinks
        });
        
        setUploadedFileId(fileId);
        
        if (response.data?.summary) {
          actions.setValidationSummary(response.data.summary);
        }

        actions.setSuccess('File uploaded and validated successfully!');
        return response.data || response;
      } else {
        actions.setError(response?.message || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      actions.setError(error.message || 'Upload failed');
      return null;
    }
  }, [state.file, state.selectedCountry, actions]);

  /**
   * Cancel upload
   */
  const cancelUpload = useCallback(() => {
    actions.reset();
    actions.setError(null);
    setUploadedFileId(null);
  }, [actions]);

  /**
   * Clear file
   */
  const clearFile = useCallback(() => {
    actions.reset();
    actions.setError(null);
    actions.setSuccess(null);
    setValidationErrors([]);
    setUploadedFileId(null);
  }, [actions]);

  /**
   * Get file info
   */
  const getFileInfo = useCallback(() => {
    if (!state.file) return null;
    return {
      name: state.file.name,
      size: state.file.size,
      sizeFormatted: formatFileSize(state.file.size),
      type: state.file.type
    };
  }, [state.file]);

  return {
    // State
    file: state.file,
    fileId: state.fileId || uploadedFileId,
    isUploading: state.isUploading,
    isUploaded: state.isUploaded,
    uploadProgress: state.uploadProgress,
    isValidating,
    validationErrors,
    error: state.error,
    success: state.successMessage,
    status: state.status,

    // Actions
    validateFile,
    handleFileSelect,
    uploadFile,
    cancelUpload,
    clearFile,
    getFileInfo,

    // Derived
    hasFile: !!state.file,
    isComplete: state.isUploaded && state.isProcessed,
    progress: state.uploadProgress
  };
};

export default useUpload;