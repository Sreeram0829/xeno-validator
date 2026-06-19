import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatFileSize } from '../../utils/formatters.js';

/**
 * Upload Section Component
 * Drag and drop file upload area
 */
const UploadSection = ({ 
  onFileSelect, 
  isUploading, 
  isUploaded,
  acceptedFileTypes = '.csv',
  maxSize = 100 * 1024 * 1024 // 100MB
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragAccept, 
    isDragReject 
  } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxSize: maxSize,
    multiple: false,
    disabled: isUploading || isUploaded
  });

  const getDropzoneStyles = () => {
    let styles = 'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ';
    
    if (isDragActive) {
      styles += 'border-blue-500 bg-blue-50 ';
    } else if (isDragAccept) {
      styles += 'border-green-500 bg-green-50 ';
    } else if (isDragReject) {
      styles += 'border-red-500 bg-red-50 ';
    } else if (isUploading || isUploaded) {
      styles += 'border-gray-300 bg-gray-50 cursor-not-allowed ';
    } else {
      styles += 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 ';
    }

    return styles;
  };

  return (
    <div className="upload-section">
      <div {...getRootProps({ className: getDropzoneStyles() })}>
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          {/* Icon */}
          <div className="mb-4">
            {isUploading ? (
              <svg className="w-16 h-16 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isUploaded ? (
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : isDragActive ? (
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            {isUploading && (
              <>
                <p className="text-lg font-medium text-gray-700">Uploading...</p>
                <p className="text-sm text-gray-500">Please wait while your file is being processed</p>
              </>
            )}
            {isUploaded && (
              <>
                <p className="text-lg font-medium text-green-600">File Uploaded Successfully!</p>
                <p className="text-sm text-gray-500">Click "Process" to validate the file</p>
              </>
            )}
            {!isUploading && !isUploaded && (
              <>
                {isDragActive ? (
                  <p className="text-lg font-medium text-blue-600">Drop your CSV file here</p>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-700">
                      Drag & drop your CSV file here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      or click to browse files
                    </p>
                  </>
                )}
              </>
            )}
          </div>

          {/* File requirements */}
          {!isUploading && !isUploaded && (
            <div className="mt-4 text-xs text-gray-400">
              <p>Accepted: <span className="font-medium text-gray-500">.csv</span></p>
              <p>Max size: <span className="font-medium text-gray-500">{formatFileSize(maxSize)}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;