/**
 * Routes Index File
 * Aggregates all route modules
 */

import express from 'express';
import uploadRoutes from './uploadRoutes.js';
import validationRoutes from './validationRoutes.js';
import downloadRoutes from './downloadRoutes.js';
import statusRoutes from './statusRoutes.js';

const router = express.Router();

// Mount routes
router.use('/upload', uploadRoutes);
router.use('/validation', validationRoutes);
router.use('/download', downloadRoutes);
router.use('/', statusRoutes); // Health, status, stats, etc.

// API root
router.get('/', (req, res) => {
  res.json({
    name: 'Xeno Transaction Validator API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      upload: '/api/upload',
      validation: '/api/validation',
      download: '/api/download',
      health: '/api/health',
      status: '/api/status',
      stats: '/api/stats'
    },
    documentation: 'See API_DOCS.md for detailed documentation'
  });
});

export default router;