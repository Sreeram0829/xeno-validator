import { responseUtils } from '../utils/responseUtils.js';
import { allowedCountries, isValidCountryCode } from '../config/allowedCountries.js';

/**
 * Validation Middleware
 * Handles request validation for API endpoints
 */
export const validationMiddleware = {
  /**
   * Validate country code in request
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Next middleware
   */
  validateCountry: (req, res, next) => {
    const country = req.body.country || req.query.country || req.params.country;
    
    if (!country) {
      return responseUtils.validationError(res, 'Country code is required', [
        { field: 'country', message: 'Country code is required' }
      ]);
    }

    if (!isValidCountryCode(country)) {
      const supported = allowedCountries.map(c => c.code).join(', ');
      return responseUtils.validationError(res, `Country '${country}' is not supported`, [
        { field: 'country', message: `Supported countries: ${supported}` }
      ]);
    }

    // Attach validated country to request
    req.validatedCountry = country.toUpperCase();
    next();
  },

  /**
   * Validate file ID in request params
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Next middleware
   */
  validateFileId: (req, res, next) => {
    const { fileId } = req.params;
    
    if (!fileId) {
      return responseUtils.validationError(res, 'File ID is required', [
        { field: 'fileId', message: 'File ID is required' }
      ]);
    }

    // Basic UUID validation (optional - can be more strict)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(fileId)) {
      return responseUtils.validationError(res, 'Invalid file ID format', [
        { field: 'fileId', message: 'File ID must be a valid UUID' }
      ]);
    }

    req.validatedFileId = fileId;
    next();
  },

  /**
   * Validate chunk index in request params
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Next middleware
   */
  validateChunkIndex: (req, res, next) => {
    const { chunkIndex } = req.params;
    
    if (!chunkIndex) {
      return responseUtils.validationError(res, 'Chunk index is required', [
        { field: 'chunkIndex', message: 'Chunk index is required' }
      ]);
    }

    const index = parseInt(chunkIndex);
    if (isNaN(index) || index < 0) {
      return responseUtils.validationError(res, 'Invalid chunk index', [
        { field: 'chunkIndex', message: 'Chunk index must be a positive number' }
      ]);
    }

    req.validatedChunkIndex = index;
    next();
  },

  /**
   * Validate request body
   * @param {Object} schema - Validation schema
   * @returns {Function} Middleware
   */
  validateBody: (schema) => {
    return (req, res, next) => {
      const errors = [];
      
      for (const [field, rules] of Object.entries(schema)) {
        const value = req.body[field];
        
        // Check required
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push({
            field: field,
            message: `${field} is required`
          });
          continue;
        }

        // Skip validation if value is empty and not required
        if (value === undefined || value === null || value === '') {
          continue;
        }

        // Type validation
        if (rules.type && typeof value !== rules.type) {
          errors.push({
            field: field,
            message: `${field} must be of type ${rules.type}`
          });
          continue;
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({
            field: field,
            message: `${field} must be at least ${rules.minLength} characters`
          });
          continue;
        }

        // Max length validation
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({
            field: field,
            message: `${field} must be at most ${rules.maxLength} characters`
          });
          continue;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({
            field: field,
            message: rules.patternMessage || `${field} has invalid format`
          });
          continue;
        }

        // Custom validation
        if (rules.custom && typeof rules.custom === 'function') {
          const result = rules.custom(value, req.body);
          if (result !== true) {
            errors.push({
              field: field,
              message: typeof result === 'string' ? result : `${field} validation failed`
            });
          }
          continue;
        }
      }

      if (errors.length > 0) {
        return responseUtils.validationError(res, 'Validation failed', errors);
      }

      next();
    };
  },

  /**
   * Validate query parameters
   * @param {Object} schema - Validation schema
   * @returns {Function} Middleware
   */
  validateQuery: (schema) => {
    return (req, res, next) => {
      const errors = [];
      
      for (const [field, rules] of Object.entries(schema)) {
        const value = req.query[field];
        
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push({
            field: field,
            message: `${field} query parameter is required`
          });
          continue;
        }

        if (value === undefined || value === null || value === '') {
          continue;
        }

        // Type validation
        if (rules.type === 'number') {
          const num = parseFloat(value);
          if (isNaN(num)) {
            errors.push({
              field: field,
              message: `${field} must be a number`
            });
            continue;
          }
          
          if (rules.min !== undefined && num < rules.min) {
            errors.push({
              field: field,
              message: `${field} must be at least ${rules.min}`
            });
            continue;
          }
          
          if (rules.max !== undefined && num > rules.max) {
            errors.push({
              field: field,
              message: `${field} must be at most ${rules.max}`
            });
            continue;
          }
        }

        if (rules.type === 'enum' && rules.values) {
          if (!rules.values.includes(value)) {
            errors.push({
              field: field,
              message: `${field} must be one of: ${rules.values.join(', ')}`
            });
            continue;
          }
        }
      }

      if (errors.length > 0) {
        return responseUtils.validationError(res, 'Query validation failed', errors);
      }

      next();
    };
  },

  /**
   * Common validation schemas
   */
  schemas: {
    uploadFile: {
      country: {
        required: false,
        type: 'string',
        minLength: 2,
        maxLength: 2,
        custom: (value) => {
          if (value && !isValidCountryCode(value)) {
            return `Country '${value}' is not supported`;
          }
          return true;
        }
      }
    },

    fileId: {
      fileId: {
        required: true,
        type: 'string',
        pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        patternMessage: 'Invalid UUID format'
      }
    },

    revalidate: {
      country: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 2,
        custom: (value) => {
          if (!isValidCountryCode(value)) {
            return `Country '${value}' is not supported`;
          }
          return true;
        }
      }
    }
  }
};

// Export individual middleware functions
export const validateCountry = validationMiddleware.validateCountry;
export const validateFileId = validationMiddleware.validateFileId;
export const validateChunkIndex = validationMiddleware.validateChunkIndex;
export const validateBody = validationMiddleware.validateBody;
export const validateQuery = validationMiddleware.validateQuery;

export default validationMiddleware;