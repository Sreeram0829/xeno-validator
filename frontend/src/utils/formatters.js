/**
 * Formatters
 * Formatting functions for display
 */

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (INR, USD, etc.)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
  }
};

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted number
 */
export const formatNumber = (number, locale = 'en-IN') => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @param {string} format - Format pattern
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'DD-MM-YYYY', locale = 'en-IN') => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const options = {
    'DD-MM-YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'MM-DD-YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
    'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
    'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
    'DD MMM YYYY': { day: '2-digit', month: 'short', year: 'numeric' },
    'MMM DD, YYYY': { month: 'short', day: '2-digit', year: 'numeric' },
    'DD MMMM YYYY': { day: '2-digit', month: 'long', year: 'numeric' },
    'MMMM DD, YYYY': { month: 'long', day: '2-digit', year: 'numeric' },
    'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    'time': { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    'datetime': { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }
  };

  const opt = options[format] || options['DD-MM-YYYY'];
  
  try {
    return new Intl.DateTimeFormat(locale, opt).format(d);
  } catch (error) {
    return d.toLocaleDateString(locale);
  }
};

/**
 * Format time ago
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Time ago string
 */
export const formatTimeAgo = (date, locale = 'en') => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) {
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  }
  if (diffMonth > 0) {
    return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  }
  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }
  if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  }
  if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  }
  if (diffSec > 10) {
    return `${diffSec} second${diffSec > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @param {string} country - Country code
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone, country = 'IN') => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  const countryFormats = {
    IN: (num) => {
      if (num.length === 10) {
        return `${num.substring(0, 5)} ${num.substring(5)}`;
      }
      if (num.length === 11 && num.startsWith('0')) {
        return `0${num.substring(1, 6)} ${num.substring(6)}`;
      }
      return num;
    },
    SG: (num) => {
      if (num.length === 8) {
        return `${num.substring(0, 4)} ${num.substring(4)}`;
      }
      return num;
    },
    US: (num) => {
      if (num.length === 10) {
        return `(${num.substring(0, 3)}) ${num.substring(3, 6)}-${num.substring(6)}`;
      }
      return num;
    }
  };

  const formatter = countryFormats[country.toUpperCase()] || ((num) => num);
  return formatter(cleaned);
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Format status
 * @param {string} status - Status string
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted status with color
 */
export const formatStatus = (status, options = {}) => {
  const statusMap = {
    success: { label: 'Success', color: '#10b981', bgColor: '#d1fae5' },
    failed: { label: 'Failed', color: '#ef4444', bgColor: '#fecaca' },
    pending: { label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7' },
    processing: { label: 'Processing', color: '#3b82f6', bgColor: '#dbeafe' },
    completed: { label: 'Completed', color: '#10b981', bgColor: '#d1fae5' },
    error: { label: 'Error', color: '#ef4444', bgColor: '#fecaca' },
    valid: { label: 'Valid', color: '#10b981', bgColor: '#d1fae5' },
    invalid: { label: 'Invalid', color: '#ef4444', bgColor: '#fecaca' },
    uploaded: { label: 'Uploaded', color: '#3b82f6', bgColor: '#dbeafe' },
    validated: { label: 'Validated', color: '#10b981', bgColor: '#d1fae5' }
  };

  const key = status?.toLowerCase() || '';
  const result = statusMap[key] || { 
    label: status || 'Unknown', 
    color: '#6b7280', 
    bgColor: '#f3f4f6' 
  };

  if (options.returnObject) {
    return result;
  }

  return {
    text: result.label,
    color: result.color,
    bgColor: result.bgColor,
    className: `status-${key}`
  };
};

/**
 * Format JSON for display
 * @param {Object} json - JSON object to format
 * @param {number} indent - Indentation spaces
 * @returns {string} Formatted JSON string
 */
export const formatJSON = (json, indent = 2) => {
  try {
    return JSON.stringify(json, null, indent);
  } catch (error) {
    return String(json);
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format camel case to words
 * @param {string} str - Camel case string
 * @returns {string} Words
 */
export const camelToWords = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

/**
 * Format snake case to words
 * @param {string} str - Snake case string
 * @returns {string} Words
 */
export const snakeToWords = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatTimeAgo,
  formatPhone,
  formatFileSize,
  formatPercentage,
  formatStatus,
  formatJSON,
  truncate,
  camelToWords,
  snakeToWords
};