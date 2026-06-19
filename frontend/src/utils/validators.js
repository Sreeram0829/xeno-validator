/**
 * Validators
 * Frontend validation functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @param {string} country - Country code (IN, SG, US, etc.)
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone, country = 'IN') => {
  if (!phone) return false;
  const phoneStr = phone.trim();
  
  // Remove spaces, dashes, parentheses
  const cleaned = phoneStr.replace(/[\s\-()]/g, '');
  
  // Country-specific validation
  const countryRules = {
    IN: { length: 10, pattern: /^[6-9]\d{9}$/ },
    SG: { length: 8, pattern: /^\d{8}$/ },
    US: { length: 10, pattern: /^\d{10}$/ },
    UK: { length: 10, pattern: /^\d{10}$/ },
    AU: { length: 9, pattern: /^\d{9}$/ },
    CA: { length: 10, pattern: /^\d{10}$/ }
  };

  const rule = countryRules[country.toUpperCase()];
  if (!rule) {
    // Default: allow 8-15 digits
    return /^\d{8,15}$/.test(cleaned);
  }

  return cleaned.length === rule.length && rule.pattern.test(cleaned);
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return !!value;
};

/**
 * Validate min length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @returns {boolean} True if valid
 */
export const isMinLength = (value, min) => {
  if (!value) return false;
  return value.length >= min;
};

/**
 * Validate max length
 * @param {string} value - Value to validate
 * @param {number} max - Maximum length
 * @returns {boolean} True if valid
 */
export const isMaxLength = (value, max) => {
  if (!value) return true;
  return value.length <= max;
};

/**
 * Validate number
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid
 */
export const isValidNumber = (value, options = {}) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  
  const { min, max, integer } = options;
  
  if (integer && !Number.isInteger(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Validate date
 * @param {string} date - Date string to validate
 * @param {string} format - Expected format
 * @returns {boolean} True if valid
 */
export const isValidDate = (date, format = 'DD-MM-YYYY') => {
  if (!date) return false;
  
  // Check if it's a valid date object first
  const d = new Date(date);
  if (!isNaN(d.getTime())) return true;
  
  // Check specific formats
  const formatPatterns = {
    'DD-MM-YYYY': /^\d{2}-\d{2}-\d{4}$/,
    'MM-DD-YYYY': /^\d{2}-\d{2}-\d{4}$/,
    'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
    'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'DD-MM-YY': /^\d{2}-\d{2}-\d{2}$/,
    'DD/MM/YY': /^\d{2}\/\d{2}\/\d{2}$/
  };

  const pattern = formatPatterns[format];
  if (!pattern) return false;
  if (!pattern.test(date)) return false;

  // Parse and validate actual date
  const parts = date.split(/[-/]/);
  let day, month, year;
  
  if (format.includes('YYYY')) {
    year = parseInt(parts[format.startsWith('DD') ? 2 : 0]);
    month = parseInt(parts[format.startsWith('DD') ? 1 : 1]) - 1;
    day = parseInt(parts[format.startsWith('DD') ? 0 : 2]);
  } else {
    year = 2000 + parseInt(parts[format.startsWith('DD') ? 2 : 0]);
    month = parseInt(parts[format.startsWith('DD') ? 1 : 1]) - 1;
    day = parseInt(parts[format.startsWith('DD') ? 0 : 2]);
  }

  const parsedDate = new Date(year, month, day);
  return parsedDate.getFullYear() === year &&
         parsedDate.getMonth() === month &&
         parsedDate.getDate() === day;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @returns {boolean} True if valid
 */
export const isValidFileType = (file, allowedTypes = ['text/csv']) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} True if valid
 */
export const isValidFileSize = (file, maxSize = 100 * 1024 * 1024) => {
  if (!file) return false;
  return file.size <= maxSize;
};

/**
 * Create validation rule object
 * @param {string} field - Field name
 * @param {Array} rules - Array of validation rules
 * @returns {Object} Validation rule object
 */
export const createValidationRules = (field, rules) => {
  return {
    field,
    rules: rules.map(rule => {
      if (typeof rule === 'string') {
        return { type: rule };
      }
      return rule;
    })
  };
};

/**
 * Validate object against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} { isValid, errors }
 */
export const validateObject = (data, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const fieldErrors = [];

    for (const rule of rules) {
      const { type, params, message } = rule;
      let valid = true;

      switch (type) {
        case 'required':
          valid = isRequired(value);
          if (!valid) fieldErrors.push(message || `${field} is required`);
          break;
        case 'email':
          valid = !value || isValidEmail(value);
          if (!valid) fieldErrors.push(message || 'Invalid email format');
          break;
        case 'phone':
          valid = !value || isValidPhone(value, params?.country);
          if (!valid) fieldErrors.push(message || 'Invalid phone number');
          break;
        case 'minLength':
          valid = !value || isMinLength(value, params?.min);
          if (!valid) fieldErrors.push(message || `Minimum length is ${params?.min}`);
          break;
        case 'maxLength':
          valid = !value || isMaxLength(value, params?.max);
          if (!valid) fieldErrors.push(message || `Maximum length is ${params?.max}`);
          break;
        case 'number':
          valid = !value || isValidNumber(value, params);
          if (!valid) fieldErrors.push(message || 'Invalid number');
          break;
        case 'url':
          valid = !value || isValidURL(value);
          if (!valid) fieldErrors.push(message || 'Invalid URL');
          break;
        case 'date':
          valid = !value || isValidDate(value, params?.format);
          if (!valid) fieldErrors.push(message || 'Invalid date format');
          break;
        default:
          break;
      }

      if (!valid) break;
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  }

  return { isValid, errors };
};

export default {
  isValidEmail,
  isValidPhone,
  isRequired,
  isMinLength,
  isMaxLength,
  isValidNumber,
  isValidURL,
  isValidDate,
  isValidFileType,
  isValidFileSize,
  createValidationRules,
  validateObject
};