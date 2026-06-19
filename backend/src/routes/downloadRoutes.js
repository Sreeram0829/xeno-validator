import express from 'express';
import { downloadController } from '../controllers/downloadController.js';
import { validateFileId, validateChunkIndex } from '../middleware/validationMiddleware.js';
import { asyncWrapper } from '../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/download/cleaned/:fileId
 * @desc    Download cleaned CSV file
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/cleaned/:fileId',
  validateFileId,
  asyncWrapper(downloadController.downloadCleanedFile)
);

/**
 * @route   GET /api/download/errors/:fileId
 * @desc    Download error report
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/errors/:fileId',
  validateFileId,
  asyncWrapper(downloadController.downloadErrorReport)
);

/**
 * @route   GET /api/download/chunk/:fileId/:chunkIndex
 * @desc    Download specific chunk
 * @access  Public
 * @params  { fileId: string, chunkIndex: number }
 */
router.get(
  '/chunk/:fileId/:chunkIndex',
  validateFileId,
  validateChunkIndex,
  asyncWrapper(downloadController.downloadChunk)
);

/**
 * @route   GET /api/download/chunks/:fileId
 * @desc    Download all chunks as zip
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/chunks/:fileId',
  validateFileId,
  asyncWrapper(downloadController.downloadAllChunks)
);

/**
 * @route   GET /api/download/chunks/info/:fileId
 * @desc    Get chunk information without downloading
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/chunks/info/:fileId',
  validateFileId,
  asyncWrapper(downloadController.getChunkInfo)
);

/**
 * @route   GET /api/download/summary/:fileId
 * @desc    Download summary report (JSON)
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/summary/:fileId',
  validateFileId,
  asyncWrapper(downloadController.downloadSummary)
);

/**
 * @route   GET /api/download/report/:fileId
 * @desc    Download text report
 * @access  Public
 * @params  { fileId: string }
 */
router.get(
  '/report/:fileId',
  validateFileId,
  asyncWrapper(downloadController.downloadTextReport)
);

export default router;