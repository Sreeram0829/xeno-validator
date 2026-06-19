import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Initial state
const initialState = {
  // File upload state
  file: null,
  fileId: null,
  fileName: null,
  fileSize: null,
  uploadProgress: 0,
  isUploading: false,
  isUploaded: false,
  
  // Validation state
  isProcessing: false,
  isProcessed: false,
  validationSummary: null,
  validationErrors: null,
  errorCount: 0,
  validCount: 0,
  totalRows: 0,
  
  // Country selection
  selectedCountry: 'IN',
  
  // Results
  results: null,
  downloadLinks: null,
  
  // UI state
  isLoading: false,
  error: null,
  successMessage: null,
  
  // Status
  status: 'idle' // idle | uploading | processing | completed | error
};

// Action types
const ACTION_TYPES = {
  SET_FILE: 'SET_FILE',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  SET_UPLOADING: 'SET_UPLOADING',
  SET_UPLOADED: 'SET_UPLOADED',
  SET_PROCESSING: 'SET_PROCESSING',
  SET_PROCESSED: 'SET_PROCESSED',
  SET_VALIDATION_SUMMARY: 'SET_VALIDATION_SUMMARY',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
  SET_COUNTRY: 'SET_COUNTRY',
  SET_RESULTS: 'SET_RESULTS',
  SET_DOWNLOAD_LINKS: 'SET_DOWNLOAD_LINKS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  RESET: 'RESET',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_SUCCESS: 'CLEAR_SUCCESS',
  SET_FILE_ID: 'SET_FILE_ID'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_FILE:
      return {
        ...state,
        file: action.payload,
        fileName: action.payload?.name || null,
        fileSize: action.payload?.size || null,
        status: 'idle'
      };

    case ACTION_TYPES.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: action.payload,
        status: action.payload === 100 ? 'uploading' : 'uploading'
      };

    case ACTION_TYPES.SET_UPLOADING:
      return {
        ...state,
        isUploading: true,
        isUploaded: false,
        uploadProgress: 0,
        status: 'uploading',
        error: null
      };

    case ACTION_TYPES.SET_UPLOADED:
      return {
        ...state,
        isUploading: false,
        isUploaded: true,
        fileId: action.payload.fileId || state.fileId,
        downloadLinks: action.payload.downloadLinks || state.downloadLinks,
        status: 'uploaded'
      };

    case ACTION_TYPES.SET_FILE_ID:
      return {
        ...state,
        fileId: action.payload
      };

    case ACTION_TYPES.SET_PROCESSING:
      return {
        ...state,
        isProcessing: true,
        isProcessed: false,
        status: 'processing',
        error: null
      };

    case ACTION_TYPES.SET_PROCESSED:
      return {
        ...state,
        isProcessing: false,
        isProcessed: true,
        status: 'completed'
      };

    case ACTION_TYPES.SET_VALIDATION_SUMMARY:
      return {
        ...state,
        validationSummary: action.payload,
        totalRows: action.payload?.total || 0,
        validCount: action.payload?.valid || 0,
        errorCount: action.payload?.invalid || 0
      };

    case ACTION_TYPES.SET_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: action.payload
      };

    case ACTION_TYPES.SET_COUNTRY:
      return {
        ...state,
        selectedCountry: action.payload
      };

    case ACTION_TYPES.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        status: 'completed'
      };

    case ACTION_TYPES.SET_DOWNLOAD_LINKS:
      return {
        ...state,
        downloadLinks: action.payload
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isUploading: false,
        isProcessing: false,
        status: 'error'
      };

    case ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        successMessage: action.payload
      };

    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ACTION_TYPES.CLEAR_SUCCESS:
      return {
        ...state,
        successMessage: null
      };

    case ACTION_TYPES.RESET:
      return {
        ...initialState,
        selectedCountry: state.selectedCountry // Preserve country selection
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext(null);

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = useMemo(() => ({
    // Set file
    setFile: (file) => {
      dispatch({ type: ACTION_TYPES.SET_FILE, payload: file });
    },

    // Set file ID
    setFileId: (fileId) => {
      dispatch({ type: ACTION_TYPES.SET_FILE_ID, payload: fileId });
    },

    // Upload progress
    setUploadProgress: (progress) => {
      dispatch({ type: ACTION_TYPES.SET_UPLOAD_PROGRESS, payload: progress });
    },

    // Start upload
    startUpload: () => {
      dispatch({ type: ACTION_TYPES.SET_UPLOADING });
    },

    // Upload complete
    uploadComplete: (data) => {
      dispatch({ type: ACTION_TYPES.SET_UPLOADED, payload: data });
    },

    // Start processing
    startProcessing: () => {
      dispatch({ type: ACTION_TYPES.SET_PROCESSING });
    },

    // Processing complete - ADD THIS
    setProcessed: (isProcessed) => {
      dispatch({ type: ACTION_TYPES.SET_PROCESSED, payload: isProcessed });
    },

    // Set validation summary
    setValidationSummary: (summary) => {
      dispatch({ type: ACTION_TYPES.SET_VALIDATION_SUMMARY, payload: summary });
    },

    // Set validation errors
    setValidationErrors: (errors) => {
      dispatch({ type: ACTION_TYPES.SET_VALIDATION_ERRORS, payload: errors });
    },

    // Set country
    setCountry: (country) => {
      dispatch({ type: ACTION_TYPES.SET_COUNTRY, payload: country });
    },

    // Set results
    setResults: (results) => {
      dispatch({ type: ACTION_TYPES.SET_RESULTS, payload: results });
    },

    // Set download links
    setDownloadLinks: (links) => {
      dispatch({ type: ACTION_TYPES.SET_DOWNLOAD_LINKS, payload: links });
    },

    // Set loading
    setLoading: (isLoading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: isLoading });
    },

    // Set error
    setError: (error) => {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    },

    // Set success
    setSuccess: (message) => {
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: message });
    },

    // Clear error
    clearError: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
    },

    // Clear success
    clearSuccess: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_SUCCESS });
    },

    // Reset state
    reset: () => {
      dispatch({ type: ACTION_TYPES.RESET });
    }
  }), []);

  // Memoized selectors
  const selectors = useMemo(() => ({
    getFileInfo: () => ({
      name: state.fileName,
      size: state.fileSize,
      id: state.fileId
    }),
    getUploadStatus: () => ({
      isUploading: state.isUploading,
      isUploaded: state.isUploaded,
      progress: state.uploadProgress
    }),
    getProcessingStatus: () => ({
      isProcessing: state.isProcessing,
      isProcessed: state.isProcessed
    }),
    getValidationSummary: () => state.validationSummary,
    getResults: () => state.results,
    getDownloadLinks: () => state.downloadLinks,
    getError: () => state.error,
    getSuccess: () => state.successMessage,
    getStatus: () => state.status,
    isLoading: () => state.isLoading,
    hasFile: () => !!state.file,
    hasResults: () => !!state.results,
    getFileId: () => state.fileId
  }), [state]);

  const value = useMemo(() => ({
    state,
    dispatch,
    actions,
    selectors
  }), [state, actions, selectors]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// HOC to wrap components with context
export const withAppContext = (Component) => {
  return (props) => (
    <AppProvider>
      <Component {...props} />
    </AppProvider>
  );
};

export default AppContext;