import React from 'react';
import { formatFileSize, formatDate } from '../../utils/formatters.js';

/**
 * File Preview Component
 * Displays uploaded file information
 */
const FilePreview = ({ 
  fileInfo, 
  onClear, 
  onUpload, 
  isUploading = false,
  uploadProgress = 0
}) => {
  if (!fileInfo) {
    return null;
  }

  const getFileIcon = (type) => {
    if (type === 'text/csv' || type?.includes('csv')) {
      return '📄';
    }
    return '📎';
  };

  return (
    <div className="file-preview">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        {/* File info */}
        <div className="flex items-center gap-4">
          <div className="text-3xl">
            {getFileIcon(fileInfo.type)}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">
              {fileInfo.name}
            </h4>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span>Size: {fileInfo.sizeFormatted || formatFileSize(fileInfo.size)}</span>
              {fileInfo.type && (
                <span>Type: {fileInfo.type}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
          {!isUploading && (
            <>
              <button
                onClick={onUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Process File
              </button>
              <button
                onClick={onClear}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Remove
              </button>
            </>
          )}

          {isUploading && (
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;