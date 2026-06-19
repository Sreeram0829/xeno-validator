import express from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { uploadSingle, handleMulterError, getFileInfo, validateFilePresence } from '../middleware/uploadMiddleware.js';
import { validateCountry } from '../middleware/validationMiddleware.js';
import { asyncWrapper } from '../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload and validate CSV file
 * @access  Public
 * @body    { file: CSV, country: string }
 */
router.post(
  '/',
  uploadSingle,
  handleMulterError,
  getFileInfo,
  validateFilePresence,
  validateCountry,
  asyncWrapper(uploadController.uploadFile)
);

/**
 * @route   POST /api/upload/validate
 * @desc    Validate file format before upload
 * @access  Public
 * @body    { file: CSV }
 */
router.post(
  '/validate',
  uploadSingle,
  handleMulterError,
  getFileInfo,
  validateFilePresence,
  asyncWrapper(uploadController.validateFile)
);

/**
 * @route   GET /api/upload/status/:fileId
 * @desc    Get upload status
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/status/:fileId',
  asyncWrapper(uploadController.getUploadStatus)
);

/**
 * @route   DELETE /api/upload/:fileId
 * @desc    Delete uploaded file and all associated data
 * @access  Public
 * @params  { fileId: string }
 */
router.delete(
  '/:fileId',
  asyncWrapper(uploadController.deleteFile)
);

export default router;