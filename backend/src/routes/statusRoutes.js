import express from 'express';
import { statusController } from '../controllers/statusController.js';
import { asyncWrapper } from '../middleware/errorMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get(
  '/health',
  asyncWrapper(statusController.healthCheck)
);

/**
 * @route   GET /api/status
 * @desc    Get system status
 * @access  Public
 */
router.get(
  '/status',
  asyncWrapper(statusController.getSystemStatus)
);

/**
 * @route   GET /api/stats
 * @desc    Get processing statistics
 * @access  Public
 */
router.get(
  '/stats',
  asyncWrapper(statusController.getStats)
);

/**
 * @route   GET /api/info
 * @desc    Get server information
 * @access  Public
 */
router.get(
  '/info',
  asyncWrapper(statusController.getServerInfo)
);

/**
 * @route   DELETE /api/cleanup
 * @desc    Clean up old files
 * @access  Public
 * @query   { days: number }
 */
router.delete(
  '/cleanup',
  asyncWrapper(statusController.cleanup)
);

/**
 * @route   GET /api/queue
 * @desc    Get queue status
 * @access  Public
 */
router.get(
  '/queue',
  asyncWrapper(statusController.getQueueStatus)
);

export default router;