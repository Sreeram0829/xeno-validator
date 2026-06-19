import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import configurations
import appConfig from './config/appConfig.js';
import { validateConfig } from './config/appConfig.js';

// Import routes
import routes from './routes/index.js';

// Import middleware
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';
import { handleMulterError } from './middleware/uploadMiddleware.js';

// Import utils
import { responseUtils } from './utils/responseUtils.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Validate configuration
try {
  validateConfig();
  console.log('✅ Configuration validated successfully');
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
  process.exit(1);
}

// Initialize Express app
const app = express();

/**
 * Ensure required directories exist
 */
const ensureDirectories = async () => {
  const dirs = [
    appConfig.files.uploadDir,
    appConfig.files.cleanedDir,
    appConfig.files.chunksDir,
    appConfig.files.reportsDir
  ];

  for (const dir of dirs) {
    const fullPath = path.resolve(dir);
    try {
      await fs.ensureDir(fullPath);
      console.log(`✅ Directory ensured: ${fullPath}`);
    } catch (error) {
      console.error(`❌ Failed to create directory ${fullPath}:`, error.message);
    }
  }
};

// Ensure directories exist on startup
await ensureDirectories();

/**
 * Middleware Configuration
 */

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://xeno-validator-tau.vercel.app'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.resolve(appConfig.files.uploadDir)));
app.use('/outputs', express.static(path.resolve(appConfig.files.outputDir)));

// Request logging middleware (development only)
if (appConfig.server.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

/**
 * API Routes
 */
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Xeno Transaction Validator API',
    version: '1.0.0',
    status: 'running',
    environment: appConfig.server.env,
    endpoints: {
      upload: '/api/upload',
      validation: '/api/validation',
      download: '/api/download',
      health: '/api/health',
      status: '/api/status',
      stats: '/api/stats',
      info: '/api/info'
    },
    documentation: 'See API_DOCS.md for detailed documentation'
  });
});

/**
 * Error Handling Middleware
 */

// 404 Not Found handler
app.use(notFound);

// Global error handler
app.use(errorMiddleware.handleError);

// Multer error handler
app.use(handleMulterError);

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // In production, you might want to log this to a file or monitoring service
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // In production, you might want to log this to a file or monitoring service
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔴 Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔴 Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

// Export app for testing
export default app;