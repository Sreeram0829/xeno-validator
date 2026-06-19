import React from 'react';

/**
 * Loader Component
 * Shows loading spinner with optional message
 */
const Loader = ({ 
  text = 'Loading...', 
  size = 'medium', 
  fullPage = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className={`${spinnerSize} border-4 border-gray-200 rounded-full`}></div>
        <div className={`${spinnerSize} border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin`}></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

/**
 * Spinner component (small, inline)
 */
export const Spinner = ({ size = 'small', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-gray-200 rounded-full"></div>
      <div className="w-full h-full border-2 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
    </div>
  );
};

export default Loader;