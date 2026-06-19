/**
 * Helper Functions
 * Common utility functions used across the application
 */

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export const generateId = (prefix = '') => {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Get nested object value safely
 * @param {Object} obj - Object to traverse
 * @param {string} path - Path to value (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if path not found
 * @returns {any} Value at path or default
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  try {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[key];
    }
    return current === undefined ? defaultValue : current;
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Set nested object value
 * @param {Object} obj - Object to modify
 * @param {string} path - Path to value
 * @param {any} value - Value to set
 * @returns {Object} Modified object
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[lastKey] = value;
  return obj;
};

/**
 * Convert bytes to human readable size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Human readable size
 */
export const bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Get file name without extension
 * @param {string} filename - File name
 * @returns {string} File name without extension
 */
export const getFileNameWithoutExtension = (filename) => {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
};

/**
 * Check if string is valid JSON
 * @param {string} str - String to check
 * @returns {boolean} True if valid JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get current timestamp in various formats
 * @param {string} format - Format type ('iso', 'date', 'time', 'datetime')
 * @returns {string} Formatted timestamp
 */
export const getTimestamp = (format = 'iso') => {
  const now = new Date();
  switch (format) {
    case 'iso':
      return now.toISOString();
    case 'date':
      return now.toLocaleDateString('en-IN');
    case 'time':
      return now.toLocaleTimeString('en-IN');
    case 'datetime':
      return now.toLocaleString('en-IN');
    default:
      return now.toISOString();
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Download data as file
 * @param {string} data - Data to download
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Download JSON as file
 * @param {Object} data - JSON data
 * @param {string} filename - File name
 */
export const downloadJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
};

/**
 * Check if running in browser
 * @returns {boolean} True if in browser
 */
export const isBrowser = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

export default {
  generateId,
  truncateText,
  debounce,
  throttle,
  deepClone,
  isEmptyObject,
  getNestedValue,
  setNestedValue,
  bytesToSize,
  getFileExtension,
  getFileNameWithoutExtension,
  isValidJSON,
  sleep,
  capitalizeFirstLetter,
  toTitleCase,
  getTimestamp,
  copyToClipboard,
  downloadFile,
  downloadJSON,
  isBrowser
};