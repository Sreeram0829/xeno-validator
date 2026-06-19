import fs from 'fs-extra';
import path from 'path';
import { csvUtils } from '../../utils/csvUtils.js';

/**
 * Error Report Service
 * Generates error reports for validation failures
 */
export const errorReport = {
  /**
   * Generate error report from validation errors
   * @param {Array} errors - Array of error objects
   * @param {string} outputPath - Output file path
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Report info
   */
  generate: async (errors, outputPath, options = {}) => {
    try {
      if (!errors || errors.length === 0) {
        // Write empty report
        await csvUtils.writeCSV(outputPath, [], ['rowNumber', 'errorType', 'errorMessage']);
        return {
          totalErrors: 0,
          filePath: outputPath,
          summary: 'No errors found'
        };
      }

      // Format errors for CSV
      const formattedErrors = errors.map(error => ({
        rowNumber: error.rowNumber || 0,
        errorType: error.type || 'Validation Error',
        errorMessage: Array.isArray(error.errors) 
          ? error.errors.join('; ') 
          : (error.message || 'Unknown error'),
        field: error.field || '',
        value: error.value || '',
        ...error.data
      }));

      // Write error report
      await csvUtils.writeCSV(outputPath, formattedErrors, {
        headers: ['rowNumber', 'errorType', 'errorMessage', 'field', 'value']
      });

      return {
        totalErrors: errors.length,
        filePath: outputPath,
        summary: `Generated error report with ${errors.length} errors`
      };
    } catch (error) {
      console.error('Error generating error report:', error);
      throw new Error(`Failed to generate error report: ${error.message}`);
    }
  },

  /**
   * Generate error report with statistics
   * @param {Array} errors - Array of error objects
   * @param {string} outputDir - Output directory
   * @param {string} fileId - File identifier
   * @returns {Promise<Object>} Report with statistics
   */
  generateWithStats: async (errors, outputDir, fileId) => {
    try {
      await fs.ensureDir(outputDir);

      // Group errors by type
      const errorTypes = {};
      errors.forEach(error => {
        const type = error.type || 'Unknown';
        if (!errorTypes[type]) {
          errorTypes[type] = 0;
        }
        errorTypes[type]++;
      });

      // Generate main error report
      const errorPath = path.join(outputDir, `${fileId}_errors.csv`);
      await errorReport.generate(errors, errorPath);

      // Generate error summary
      const summaryPath = path.join(outputDir, `${fileId}_error_summary.json`);
      const summary = {
        fileId: fileId,
        totalErrors: errors.length,
        errorTypes: errorTypes,
        topErrors: Object.entries(errorTypes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([type, count]) => ({ type, count })),
        timestamp: new Date().toISOString()
      };

      await fs.writeJson(summaryPath, summary, { spaces: 2 });

      return {
        totalErrors: errors.length,
        errorReportPath: errorPath,
        summaryPath: summaryPath,
        errorTypes: errorTypes,
        topErrors: summary.topErrors
      };
    } catch (error) {
      console.error('Error generating error report with stats:', error);
      throw new Error(`Failed to generate error report: ${error.message}`);
    }
  },

  /**
   * Generate error report in JSON format
   * @param {Array} errors - Array of error objects
   * @param {string} outputPath - Output file path
   * @returns {Promise<Object>} Report info
   */
  generateJSON: async (errors, outputPath) => {
    try {
      const report = {
        totalErrors: errors.length,
        errors: errors,
        generatedAt: new Date().toISOString()
      };

      await fs.writeJson(outputPath, report, { spaces: 2 });

      return {
        totalErrors: errors.length,
        filePath: outputPath
      };
    } catch (error) {
      console.error('Error generating JSON error report:', error);
      throw new Error(`Failed to generate JSON error report: ${error.message}`);
    }
  },

  /**
   * Get error statistics
   * @param {Array} errors - Array of error objects
   * @returns {Object} Error statistics
   */
  getErrorStats: (errors) => {
    const stats = {
      total: errors.length,
      byType: {},
      byField: {},
      uniqueErrors: new Set(),
      topErrors: []
    };

    errors.forEach(error => {
      // Group by type
      const type = error.type || 'Unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Group by field
      const field = error.field || 'unknown';
      stats.byField[field] = (stats.byField[field] || 0) + 1;

      // Track unique errors
      const errorMsg = Array.isArray(error.errors) 
        ? error.errors.join('; ') 
        : (error.message || 'Unknown error');
      stats.uniqueErrors.add(errorMsg);
    });

    // Get top errors
    stats.topErrors = Object.entries(stats.byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    stats.uniqueErrorsCount = stats.uniqueErrors.size;

    return stats;
  }
};

export default errorReport;