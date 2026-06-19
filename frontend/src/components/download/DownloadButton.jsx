import React from 'react';

/**
 * Download Button Component
 * Reusable button for downloading files
 */
const DownloadButton = ({ 
  label, 
  onClick, 
  isDownloading = false,
  icon = 'file',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    white: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
  };

  const getIcon = () => {
    const icons = {
      cleaned: '📄',
      errors: '⚠️',
      summary: '📊',
      report: '📝',
      chunks: '📦',
      zip: '📦',
      file: '📎',
      download: '⬇️'
    };
    return icons[icon] || icons.file;
  };

  return (
    <button
      onClick={onClick}
      disabled={isDownloading || disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors w-full
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${(isDownloading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
        ${className}
      `}
    >
      <span className={isDownloading ? 'animate-spin' : ''}>
        {isDownloading ? '⏳' : getIcon()}
      </span>
      {isDownloading ? 'Downloading...' : label}
    </button>
  );
};

export default DownloadButton;