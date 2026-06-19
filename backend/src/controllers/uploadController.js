import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import appConfig from '../config/appConfig.js';
import { validateTransactionFile } from '../services/validation/transactionValidation.js';
import { responseUtils } from '../utils/responseUtils.js';
import { csvUtils } from '../utils/csvUtils.js';
import { fileUtils } from '../utils/fileUtils.js';
import { isValidCountryCode } from '../config/allowedCountries.js';

/**
 * Upload Controller
 * Handles file upload and initiates validation process
 */
export const uploadController = {
  /**
   * Upload and process CSV file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  uploadFile: async (req, res) => {
    try {
      console.log('📤 Upload request received');
      console.log('File:', req.file);
      console.log('Body:', req.body);

      // Check if file was uploaded
      if (!req.file) {
        console.log('❌ No file uploaded');
        return responseUtils.error(res, 'No file uploaded', 400);
      }

      // Get country code from request body
      const countryCode = req.body.country || appConfig.validation.defaultCountry;
      console.log('🌍 Country:', countryCode);
      
      // Validate country code
      if (!isValidCountryCode(countryCode)) {
        console.log('❌ Invalid country:', countryCode);
        return responseUtils.error(res, `Country ${countryCode} is not supported`, 400);
      }

      // Get file details
      const file = req.file;
      const fileId = uuidv4();
      console.log('📄 File ID:', fileId);
      
      const originalFileName = path.parse(file.originalname).name;
      const uniqueFileName = `${fileId}_${originalFileName}${path.extname(file.originalname)}`;
      const filePath = path.join(appConfig.files.uploadDir, uniqueFileName);

      // Move file from temp to uploads directory
      console.log('📁 Moving file to:', filePath);
      await fs.move(file.path, filePath, { overwrite: true });
      console.log('✅ File moved successfully');

      // Start validation process
      console.log('🔍 Starting validation...');
      const validationResult = await validateTransactionFile(filePath, countryCode, fileId);
      console.log('✅ Validation complete:', validationResult.summary);

      // Create chunks from cleaned file
      let chunkInfo = null;
      try {
        const cleanedFilePath = validationResult.cleanedFilePath;
        if (cleanedFilePath && await fs.pathExists(cleanedFilePath)) {
          console.log('📦 Creating chunks from cleaned file...');
          const chunkSize = appConfig.files.chunkSize || 1000;
          chunkInfo = await csvUtils.splitCSV(cleanedFilePath, chunkSize, appConfig.files.chunksDir, fileId);
          console.log('✅ Chunks created:', chunkInfo);
        }
      } catch (chunkError) {
        console.warn('⚠️ Failed to create chunks:', chunkError.message);
        // Don't fail the whole process if chunking fails
      }

      // Prepare response with proper data structure
      const responseData = {
        fileId: fileId,
        fileName: file.originalname,
        fileSize: file.size,
        country: countryCode,
        status: 'completed',
        summary: {
          total: validationResult.summary?.total || 0,
          valid: validationResult.summary?.valid || 0,
          invalid: validationResult.summary?.invalid || 0,
          errorRate: validationResult.summary?.errorRate || 0
        },
        chunks: chunkInfo || { totalChunks: 0, chunks: [] },
        downloadLinks: {
          cleanedFile: `/api/download/cleaned/${fileId}`,
          errorReport: `/api/download/errors/${fileId}`,
          chunks: `/api/download/chunks/${fileId}`,
          summary: `/api/download/summary/${fileId}`,
          report: `/api/download/report/${fileId}`
        }
      };

      return responseUtils.success(res, responseData, 'File uploaded and validated successfully');

    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('Stack:', error.stack);
      return responseUtils.error(res, error.message || 'File upload failed', 500);
    }
  },

  /**
   * Validate file format before upload
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  validateFile: async (req, res) => {
    try {
      if (!req.file) {
        return responseUtils.error(res, 'No file uploaded', 400);
      }

      const file = req.file;
      
      // Check file extension
      const ext = path.extname(file.originalname).toLowerCase();
      if (!appConfig.files.allowedExtensions.includes(ext)) {
        return responseUtils.error(res, `File type ${ext} not allowed. Please upload CSV files only.`, 400);
      }

      // Check file size
      if (file.size > appConfig.files.maxFileSize) {
        return responseUtils.error(res, `File size exceeds maximum limit of ${appConfig.files.maxFileSize / 1000000}MB`, 400);
      }

      // Validate CSV structure
      const validation = await csvUtils.validateCSV(file.path, ['order_id', 'amount']);
      
      return responseUtils.success(res, {
        isValid: true,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        csvValidation: validation
      }, 'File validation successful');

    } catch (error) {
      console.error('File validation error:', error);
      return responseUtils.error(res, 'File validation failed', 500);
    }
  },

  /**
   * Get upload status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUploadStatus: async (req, res) => {
    try {
      const { fileId } = req.params;
      
      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Check if summary report exists
      const summaryPath = path.join(appConfig.files.reportsDir, `${fileId}_summary.json`);
      
      if (await fs.pathExists(summaryPath)) {
        const summary = await fs.readJson(summaryPath);
        return responseUtils.success(res, summary, 'Status retrieved successfully');
      }

      // Fallback: check if file exists in uploads
      const uploadDir = appConfig.files.uploadDir;
      const files = await fs.glob(path.join(uploadDir, `${fileId}_*.csv`));
      
      if (files.length === 0) {
        return responseUtils.error(res, 'File not found', 404);
      }

      const filePath = files[0];
      const stats = await fs.stat(filePath);
      
      return responseUtils.success(res, {
        fileId: fileId,
        fileName: path.basename(filePath),
        fileSize: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        status: 'uploaded'
      }, 'Upload status retrieved successfully');

    } catch (error) {
      console.error('Get upload status error:', error);
      return responseUtils.error(res, 'Failed to get upload status', 500);
    }
  },

  /**
   * Delete uploaded file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteFile: async (req, res) => {
    try {
      const { fileId } = req.params;
      
      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Delete from uploads
      const uploadDir = appConfig.files.uploadDir;
      const files = await fs.glob(path.join(uploadDir, `${fileId}_*.csv`));
      
      for (const file of files) {
        await fs.remove(file);
      }

      // Delete from outputs
      const outputDirs = [
        appConfig.files.cleanedDir,
        appConfig.files.chunksDir,
        appConfig.files.reportsDir
      ];

      let deletedCount = 0;
      for (const dir of outputDirs) {
        const pattern = path.join(dir, `${fileId}_*`);
        const dirFiles = await fs.glob(pattern);
        for (const file of dirFiles) {
          await fs.remove(file);
          deletedCount++;
        }
      }

      return responseUtils.success(res, {
        fileId: fileId,
        deletedFiles: deletedCount + files.length,
        message: 'File and associated data deleted successfully'
      }, 'File deleted successfully');

    } catch (error) {
      console.error('Delete file error:', error);
      return responseUtils.error(res, 'Failed to delete file', 500);
    }
  }
};

export default uploadController;