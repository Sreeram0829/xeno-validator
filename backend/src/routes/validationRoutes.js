import express from 'express';
import { validationController } from '../controllers/validationController.js';
import { validateFileId } from '../middleware/validationMiddleware.js';
import { asyncWrapper } from '../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/validation/status/:fileId
 * @desc    Get validation status
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/status/:fileId',
  validateFileId,
  asyncWrapper(validationController.getValidationStatus)
);

/**
 * @route   GET /api/validation/summary/:fileId
 * @desc    Get validation summary
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/summary/:fileId',
  validateFileId,
  asyncWrapper(validationController.getValidationSummary)
);

/**
 * @route   GET /api/validation/errors/:fileId
 * @desc    Get validation errors
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/errors/:fileId',
  validateFileId,
  asyncWrapper(validationController.getValidationErrors)
);

/**
 * @route   POST /api/validation/revalidate/:fileId
 * @desc    Re-validate file with different country
 * @access  Public
 * @params  { fileId: string }
 * @body    { country: string }
 */
router.post(
  '/revalidate/:fileId',
  validateFileId,
  asyncWrapper(validationController.revalidateFile)
);

/**
 * @route   GET /api/validation/reports
 * @desc    Get all validation reports
 * @access  Public
 */
router.get(
  '/reports',
  asyncWrapper(validationController.getAllReports)
);

/**
 * @route   DELETE /api/validation/:fileId
 * @desc    Delete validation report
 * @access  Public
 * @params  { fileId: string }
 */
router.delete(
  '/:fileId',
  validateFileId,
  asyncWrapper(validationController.deleteReport)
);

export default router;