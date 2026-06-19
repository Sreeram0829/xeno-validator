import { responseUtils } from '../utils/responseUtils.js';
import CONSTANTS from '../utils/constants.js';

/**
 * Global Error Handler Middleware
 * Handles all errors in the application
 */
export const errorMiddleware = {
  /**
   * Global error handler
   * @param {Error} err - Error object
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Next middleware
   */
  handleError: (err, req, res, next) => {
    console.error('Error occurred:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params
    });

    // Default error status and message
    let statusCode = err.statusCode || CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || null;

    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = CONSTANTS.HTTP_STATUS.BAD_REQUEST;
      message = 'Validation Error';
      errors = err.errors || err.message;
    }

    if (err.name === 'UnauthorizedError') {
      statusCode = CONSTANTS.HTTP_STATUS.UNAUTHORIZED;
      message = 'Unauthorized Access';
    }

    if (err.name === 'ForbiddenError') {
      statusCode = CONSTANTS.HTTP_STATUS.FORBIDDEN;
      message = 'Forbidden Access';
    }

    if (err.name === 'NotFoundError') {
      statusCode = CONSTANTS.HTTP_STATUS.NOT_FOUND;
      message = 'Resource Not Found';
    }

    if (err.code === 'ENOENT') {
      statusCode = CONSTANTS.HTTP_STATUS.NOT_FOUND;
      message = 'File not found';
    }

    return responseUtils.error(res, message, statusCode, errors);
  },

  /**
   * 404 Not Found handler
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Next middleware
   */
  notFound: (req, res, next) => {
    const error = new Error(`Route ${req.method} ${req.path} not found`);
    error.statusCode = CONSTANTS.HTTP_STATUS.NOT_FOUND;
    error.name = 'NotFoundError';
    next(error);
  },

  /**
   * Async error wrapper
   * @param {Function} fn - Async function to wrap
   * @returns {Function} Wrapped function
   */
  asyncWrapper: (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  },

  /**
   * Handle uncaught exceptions
   * @param {Error} err - Error object
   */
  handleUncaughtException: (err) => {
    console.error('Uncaught Exception:', err);
    // Log to file or monitoring service
    process.exit(1);
  },

  /**
   * Handle unhandled rejections
   * @param {Error} err - Error object
   */
  handleUnhandledRejection: (err) => {
    console.error('Unhandled Rejection:', err);
    // Log to file or monitoring service
  },

  /**
   * Create custom error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} errors - Additional error details
   * @returns {Error} Custom error
   */
  createError: (message, statusCode = 400, errors = null) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.errors = errors;
    return error;
  },

  /**
   * Validation error creator
   * @param {Array} validationErrors - Array of validation errors
   * @returns {Error} Validation error
   */
  createValidationError: (validationErrors) => {
    const error = new Error('Validation failed');
    error.name = 'ValidationError';
    error.statusCode = CONSTANTS.HTTP_STATUS.BAD_REQUEST;
    error.errors = validationErrors;
    return error;
  },

  /**
   * Not found error creator
   * @param {string} resource - Resource name
   * @param {string} id - Resource ID
   * @returns {Error} Not found error
   */
  createNotFoundError: (resource, id) => {
    const error = new Error(`${resource} with ID ${id} not found`);
    error.name = 'NotFoundError';
    error.statusCode = CONSTANTS.HTTP_STATUS.NOT_FOUND;
    return error;
  }
};

// Export individual middleware functions
export const handleError = errorMiddleware.handleError;
export const notFound = errorMiddleware.notFound;
export const asyncWrapper = errorMiddleware.asyncWrapper;
export const createError = errorMiddleware.createError;
export const createValidationError = errorMiddleware.createValidationError;
export const createNotFoundError = errorMiddleware.createNotFoundError;

export default errorMiddleware;