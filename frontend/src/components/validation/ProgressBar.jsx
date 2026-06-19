import React from 'react';

/**
 * Progress Bar Component
 * Shows progress for uploads, processing, and downloads
 */
const ProgressBar = ({ 
  progress = 0, 
  label = 'Processing...', 
  status = 'idle',
  showPercentage = true,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  };

  const statusColors = {
    idle: 'bg-gray-200',
    uploading: 'bg-blue-500',
    processing: 'bg-purple-500',
    downloading: 'bg-green-500',
    completed: 'bg-green-500',
    error: 'bg-red-500'
  };

  const progressColor = statusColors[status] || statusColors.idle;
  const barHeight = sizeClasses[size] || sizeClasses.medium;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return '📤';
      case 'processing':
        return '⚙️';
      case 'downloading':
        return '📥';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusText = () => {
    if (progress === 100 && status !== 'error') {
      return 'Complete!';
    }
    return label;
  };

  return (
    <div className="progress-bar w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {getStatusIcon()} {getStatusText()}
          </span>
        </div>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress bar track */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${barHeight}`}>
        <div 
          className={`${progressColor} rounded-full transition-all duration-500 ease-out ${barHeight}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>

      {/* Additional info */}
      {status === 'uploading' && progress < 100 && (
        <p className="text-xs text-gray-400 mt-1">
          Uploading file... Please wait
        </p>
      )}
      {status === 'processing' && progress < 100 && (
        <p className="text-xs text-gray-400 mt-1">
          Validating data... This may take a moment
        </p>
      )}
      {status === 'downloading' && progress < 100 && (
        <p className="text-xs text-gray-400 mt-1">
          Downloading file...
        </p>
      )}
      {progress === 100 && status !== 'error' && (
        <p className="text-xs text-green-500 mt-1">
          ✓ Process completed successfully
        </p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1">
          ✗ An error occurred during processing
        </p>
      )}
    </div>
  );
};

export default ProgressBar;