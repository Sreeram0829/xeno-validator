import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import appConfig from '../config/appConfig.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.resolve(appConfig.files.uploadDir);
fs.ensureDirSync(uploadDir);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow CSV files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = appConfig.files.allowedExtensions || ['.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;
  
  // Check extension
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Please upload CSV files only. Received: ${ext}`), false);
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: appConfig.files.maxFileSize || 100 * 1024 * 1024, // 100MB default
    files: 1 // Only one file at a time
  }
});

// Single file upload middleware
export const uploadSingle = upload.single('file');

// Error handler for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        success: false,
        message: `File too large. Maximum size is ${appConfig.files.maxFileSize / (1024 * 1024)}MB`,
        error: err.message
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed',
        error: err.message
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Expected "file"',
        error: err.message
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }
  
  // Other errors
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed',
      error: err.message
    });
  }
  
  next();
};

// Get file info middleware
export const getFileInfo = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  req.fileInfo = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    destination: req.file.destination
  };

  next();
};

// Validate file presence
export const validateFilePresence = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Please upload a CSV file.'
    });
  }
  next();
};

export default {
  upload,
  uploadSingle,
  handleMulterError,
  getFileInfo,
  validateFilePresence
};