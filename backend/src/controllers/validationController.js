import fs from 'fs-extra';
import path from 'path';
import appConfig from '../config/appConfig.js';
import { responseUtils } from '../utils/responseUtils.js';
import { summaryReport } from '../services/report/summaryReport.js';
import { errorReport } from '../services/report/errorReport.js';
import { validateTransactionFile } from '../services/validation/transactionValidation.js';
import { isValidCountryCode } from '../config/allowedCountries.js';

/**
 * Validation Controller
 * Handles validation status, reports, and re-validation
 */
export const validationController = {
  /**
   * Get validation status for a file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getValidationStatus: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Check if validation report exists
      const reportPath = path.join(appConfig.files.reportsDir, `${fileId}_summary.json`);
      
      if (!await fs.pathExists(reportPath)) {
        return responseUtils.error(res, 'Validation report not found', 404);
      }

      // Read the report
      const report = await fs.readJson(reportPath);

      return responseUtils.success(res, {
        fileId: fileId,
        status: report.status || 'completed',
        summary: report.summary,
        timestamp: report.timestamp,
        fileInfo: report.fileInfo
      }, 'Validation status retrieved successfully');

    } catch (error) {
      console.error('Get validation status error:', error);
      return responseUtils.error(res, 'Failed to retrieve validation status', 500);
    }
  },

  /**
   * Get validation summary for a file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getValidationSummary: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Check if summary report exists
      const summaryPath = path.join(appConfig.files.reportsDir, `${fileId}_summary.json`);
      
      if (!await fs.pathExists(summaryPath)) {
        return responseUtils.error(res, 'Summary report not found', 404);
      }

      const summary = await fs.readJson(summaryPath);

      return responseUtils.success(res, summary, 'Validation summary retrieved successfully');

    } catch (error) {
      console.error('Get validation summary error:', error);
      return responseUtils.error(res, 'Failed to retrieve validation summary', 500);
    }
  },

  /**
   * Get validation errors for a file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getValidationErrors: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Check if error report exists
      const errorPath = path.join(appConfig.files.reportsDir, `${fileId}_errors.csv`);
      
      if (!await fs.pathExists(errorPath)) {
        // Try JSON format
        const jsonPath = path.join(appConfig.files.reportsDir, `${fileId}_errors.json`);
        if (!await fs.pathExists(jsonPath)) {
          return responseUtils.error(res, 'Error report not found', 404);
        }
        const errors = await fs.readJson(jsonPath);
        return responseUtils.success(res, errors, 'Validation errors retrieved successfully');
      }

      // Read CSV error report
      const csvData = await fs.readFile(errorPath, 'utf8');
      const lines = csvData.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
          return obj;
        }, {});
      });

      return responseUtils.success(res, {
        fileId: fileId,
        totalErrors: rows.length,
        errors: rows
      }, 'Validation errors retrieved successfully');

    } catch (error) {
      console.error('Get validation errors error:', error);
      return responseUtils.error(res, 'Failed to retrieve validation errors', 500);
    }
  },

  /**
   * Re-validate a file with different country rules
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  revalidateFile: async (req, res) => {
    try {
      const { fileId } = req.params;
      const { country } = req.body;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      if (!country) {
        return responseUtils.error(res, 'Country code is required for re-validation', 400);
      }

      if (!isValidCountryCode(country)) {
        return responseUtils.error(res, `Country ${country} is not supported`, 400);
      }

      // Check if original file exists
      const filePath = path.join(appConfig.files.uploadDir, `${fileId}_*.csv`);
      const files = await fs.glob(filePath);
      
      if (files.length === 0) {
        return responseUtils.error(res, 'Original file not found', 404);
      }

      // Re-validate with new country
      const validationResult = await validateTransactionFile(files[0], country, fileId);

      return responseUtils.success(res, {
        fileId: fileId,
        country: country,
        summary: validationResult.summary,
        message: 'File re-validated successfully'
      }, 'File re-validated successfully');

    } catch (error) {
      console.error('Re-validation error:', error);
      return responseUtils.error(res, 'Failed to re-validate file', 500);
    }
  },

  /**
   * Get all validation reports
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllReports: async (req, res) => {
    try {
      const reportsDir = appConfig.files.reportsDir;
      
      if (!await fs.pathExists(reportsDir)) {
        return responseUtils.success(res, [], 'No reports found');
      }

      const files = await fs.readdir(reportsDir);
      const reports = files
        .filter(file => file.endsWith('_summary.json'))
        .map(file => {
          const fileId = file.replace('_summary.json', '');
          return { fileId, fileName: file };
        });

      // Get details for each report
      const reportDetails = [];
      for (const report of reports) {
        try {
          const summaryPath = path.join(reportsDir, report.fileName);
          const summary = await fs.readJson(summaryPath);
          reportDetails.push({
            fileId: report.fileId,
            fileName: report.fileName,
            summary: summary.summary,
            timestamp: summary.timestamp,
            country: summary.country
          });
        } catch (error) {
          reportDetails.push(report);
        }
      }

      return responseUtils.success(res, reportDetails, 'Reports retrieved successfully');

    } catch (error) {
      console.error('Get all reports error:', error);
      return responseUtils.error(res, 'Failed to retrieve reports', 500);
    }
  },

  /**
   * Delete validation report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteReport: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Delete all files associated with this fileId
      const patterns = [
        `${fileId}_summary.json`,
        `${fileId}_errors.csv`,
        `${fileId}_errors.json`,
        `${fileId}_cleaned.csv`,
        `${fileId}_*.csv`,
        `${fileId}_report.txt`
      ];

      let deletedCount = 0;
      const dirs = [
        appConfig.files.reportsDir,
        appConfig.files.cleanedDir,
        appConfig.files.chunksDir
      ];

      for (const dir of dirs) {
        for (const pattern of patterns) {
          try {
            const files = await fs.glob(path.join(dir, pattern));
            for (const file of files) {
              await fs.remove(file);
              deletedCount++;
            }
          } catch (error) {
            // Continue with next pattern
          }
        }
      }

      return responseUtils.success(res, {
        fileId: fileId,
        deletedFiles: deletedCount,
        message: 'Report deleted successfully'
      }, 'Report deleted successfully');

    } catch (error) {
      console.error('Delete report error:', error);
      return responseUtils.error(res, 'Failed to delete report', 500);
    }
  }
};

export default validationController;