/**
 * Middleware Index File
 * Exports all middleware modules
 */

export { default as uploadMiddleware } from './uploadMiddleware.js';
export { default as errorMiddleware } from './errorMiddleware.js';
export { default as validationMiddleware } from './validationMiddleware.js';

// Export individual functions from upload middleware
export {
  upload,
  uploadSingle,
  handleMulterError,
  getFileInfo,
  validateFilePresence
} from './uploadMiddleware.js';

// Export individual functions from error middleware
export {
  handleError,
  notFound,
  asyncWrapper,
  createError,
  createValidationError,
  createNotFoundError
} from './errorMiddleware.js';

// Export individual functions from validation middleware
export {
  validateCountry,
  validateFileId,
  validateChunkIndex,
  validateBody,
  validateQuery
} from './validationMiddleware.js';