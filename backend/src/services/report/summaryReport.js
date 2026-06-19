import fs from 'fs-extra';
import path from 'path';

/**
 * Summary Report Service
 * Generates summary reports for validation results
 */
export const summaryReport = {
  /**
   * Generate summary report
   * @param {Object} validationResult - Validation result object
   * @param {string} outputPath - Output file path
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Report info
   */
  generate: async (validationResult, outputPath, options = {}) => {
    try {
      const summary = {
        generatedAt: new Date().toISOString(),
        totalRecords: validationResult.total || 0,
        validRecords: validationResult.valid || 0,
        invalidRecords: validationResult.invalid || 0,
        errorRate: validationResult.total > 0 
          ? (validationResult.invalid / validationResult.total * 100).toFixed(2)
          : 0,
        country: options.country || 'IN',
        fileInfo: options.fileInfo || {},
        ...options.additionalInfo
      };

      await fs.writeJson(outputPath, summary, { spaces: 2 });

      return {
        filePath: outputPath,
        summary: summary
      };
    } catch (error) {
      console.error('Error generating summary report:', error);
      throw new Error(`Failed to generate summary report: ${error.message}`);
    }
  },

  /**
   * Generate comprehensive summary report
   * @param {Object} data - Complete validation data
   * @param {string} outputDir - Output directory
   * @param {string} fileId - File identifier
   * @returns {Promise<Object>} Complete report
   */
  generateComprehensive: async (data, outputDir, fileId) => {
    try {
      await fs.ensureDir(outputDir);

      const {
        validationResult,
        fileInfo,
        country,
        errors,
        validRows,
        chunks
      } = data;

      // Generate main summary
      const summaryPath = path.join(outputDir, `${fileId}_summary.json`);
      const summary = {
        fileId: fileId,
        country: country,
        timestamp: new Date().toISOString(),
        summary: {
          total: validationResult.total || 0,
          valid: validationResult.valid || 0,
          invalid: validationResult.invalid || 0,
          errorRate: validationResult.total > 0 
            ? (validationResult.invalid / validationResult.total * 100).toFixed(2)
            : 0
        },
        fileInfo: {
          originalName: fileInfo.originalName || 'unknown',
          size: fileInfo.size || 0,
          columns: fileInfo.columns || [],
          chunks: chunks || 0
        },
        ...(errors && { totalErrors: errors.length }),
        ...(validRows && { totalValidRows: validRows.length })
      };

      await fs.writeJson(summaryPath, summary, { spaces: 2 });

      // Generate human-readable report
      const reportPath = path.join(outputDir, `${fileId}_report.txt`);
      const reportContent = summaryReport.generateTextReport(summary);
      await fs.writeFile(reportPath, reportContent);

      return {
        summaryPath: summaryPath,
        reportPath: reportPath,
        summary: summary
      };
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      throw new Error(`Failed to generate comprehensive report: ${error.message}`);
    }
  },

  /**
   * Generate text report
   * @param {Object} summary - Summary object
   * @returns {string} Text report
   */
  generateTextReport: (summary) => {
    const lines = [];
    lines.push('='.repeat(60));
    lines.push('VALIDATION SUMMARY REPORT');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`File ID: ${summary.fileId || 'N/A'}`);
    lines.push(`Country: ${summary.country || 'N/A'}`);
    lines.push(`Generated: ${summary.timestamp || new Date().toISOString()}`);
    lines.push('');
    lines.push('-'.repeat(60));
    lines.push('SUMMARY STATISTICS');
    lines.push('-'.repeat(60));
    lines.push(`Total Records: ${summary.summary.total}`);
    lines.push(`Valid Records: ${summary.summary.valid}`);
    lines.push(`Invalid Records: ${summary.summary.invalid}`);
    lines.push(`Error Rate: ${summary.summary.errorRate}%`);
    lines.push('');
    lines.push('-'.repeat(60));
    lines.push('FILE INFORMATION');
    lines.push('-'.repeat(60));
    if (summary.fileInfo) {
      lines.push(`Original File: ${summary.fileInfo.originalName || 'N/A'}`);
      lines.push(`File Size: ${summary.fileInfo.size || 0} bytes`);
      lines.push(`Columns: ${(summary.fileInfo.columns || []).join(', ')}`);
      lines.push(`Chunks: ${summary.fileInfo.chunks || 0}`);
    }
    lines.push('');
    if (summary.totalErrors !== undefined) {
      lines.push(`Total Errors: ${summary.totalErrors}`);
    }
    if (summary.totalValidRows !== undefined) {
      lines.push(`Total Valid Rows: ${summary.totalValidRows}`);
    }
    lines.push('');
    lines.push('='.repeat(60));
    lines.push('END OF REPORT');
    lines.push('='.repeat(60));

    return lines.join('\n');
  },

  /**
   * Get summary statistics
   * @param {Object} validationResult - Validation result
   * @param {Object} options - Options
   * @returns {Object} Statistics
   */
  getStats: (validationResult, options = {}) => {
    const total = validationResult.total || 0;
    const valid = validationResult.valid || 0;
    const invalid = validationResult.invalid || 0;

    return {
      totalRecords: total,
      validRecords: valid,
      invalidRecords: invalid,
      successRate: total > 0 ? (valid / total * 100).toFixed(2) : 0,
      errorRate: total > 0 ? (invalid / total * 100).toFixed(2) : 0,
      status: invalid === 0 ? 'PASSED' : (valid === 0 ? 'FAILED' : 'PARTIAL'),
      ...options
    };
  }
};

export default summaryReport;