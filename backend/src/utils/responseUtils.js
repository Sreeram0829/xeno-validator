/**
 * Response Utilities
 * Standardized API response handlers
 */

export const responseUtils = {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message: message,
      data: data,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {any} errors - Additional error details
   */
  error: (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message: message,
      errors: errors,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {string} message - Not found message
   */
  notFound: (res, message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message: message,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {string} message - Validation error message
   * @param {any} errors - Validation errors details
   */
  validationError: (res, message = 'Validation failed', errors = null) => {
    return res.status(400).json({
      success: false,
      message: message,
      errors: errors,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  unauthorized: (res, message = 'Unauthorized access') => {
    return res.status(401).json({
      success: false,
      message: message,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   */
  forbidden: (res, message = 'Access forbidden') => {
    return res.status(403).json({
      success: false,
      message: message,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Paginated success response
   * @param {Object} res - Express response object
   * @param {any} data - Response data
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items
   * @param {string} message - Success message
   */
  paginated: (res, data, page, limit, total, message = 'Success') => {
    return res.status(200).json({
      success: true,
      message: message,
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    });
  }
};

export default responseUtils;