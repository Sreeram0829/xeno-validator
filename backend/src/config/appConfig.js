import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Application configuration
 * Centralized configuration management
 */
export const appConfig = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
  },

  // File Configuration
  files: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '100000000', 10), // 100MB
    uploadDir: process.env.UPLOAD_DIR || './src/uploads',
    outputDir: process.env.OUTPUT_DIR || './src/outputs',
    cleanedDir: process.env.CLEANED_DIR || './src/outputs/cleaned',
    chunksDir: process.env.CHUNKS_DIR || './src/outputs/chunks',
    reportsDir: process.env.REPORTS_DIR || './src/outputs/reports',
    chunkSize: parseInt(process.env.CHUNK_SIZE || '1000', 10), // Rows per chunk
    allowedExtensions: ['.csv'],
    allowedMimeTypes: ['text/csv', 'application/csv', 'application/vnd.ms-excel']
  },

  // Validation Configuration
  validation: {
    defaultCountry: process.env.COUNTRY_DEFAULT || 'IN',
    allowedCountries: (process.env.ALLOWED_COUNTRIES || 'IN,SG,US,UK,AU,CA').split(','),
    maxErrorsToReport: parseInt(process.env.MAX_ERRORS_REPORT || '10000', 10),
    dateFormats: ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY']
  },

  // CORS Configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Paths
  paths: {
    root: path.resolve(__dirname, '../../..'),
    backend: path.resolve(__dirname, '../..'),
    uploads: path.resolve(process.env.UPLOAD_DIR || './src/uploads'),
    outputs: path.resolve(process.env.OUTPUT_DIR || './src/outputs'),
    cleaned: path.resolve(process.env.CLEANED_DIR || './src/outputs/cleaned'),
    chunks: path.resolve(process.env.CHUNKS_DIR || './src/outputs/chunks'),
    reports: path.resolve(process.env.REPORTS_DIR || './src/outputs/reports')
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  }
};

/**
 * Get configuration value by path
 * @param {string} path - Dot notation path (e.g., 'server.port')
 * @returns {any} Configuration value
 */
export const getConfig = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], appConfig);
};

/**
 * Validate required configuration
 * @throws {Error} If required config is missing
 */
export const validateConfig = () => {
  const required = ['server.port', 'files.maxFileSize'];
  const missing = required.filter(key => {
    const value = getConfig(key);
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
};

export default appConfig;