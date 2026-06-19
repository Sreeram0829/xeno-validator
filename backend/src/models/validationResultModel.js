/**
 * Validation Result Model
 * Defines the structure for validation results
 */
export class ValidationResultModel {
  constructor(data = {}) {
    this.fileId = data.fileId || '';
    this.fileName = data.fileName || '';
    this.country = data.country || 'IN';
    this.totalRows = data.totalRows || 0;
    this.validRows = data.validRows || 0;
    this.invalidRows = data.invalidRows || 0;
    this.errors = data.errors || [];
    this.validData = data.validData || [];
    this.summary = data.summary || {};
    this.timestamp = data.timestamp || new Date().toISOString();
    this.status = data.status || 'pending';
    this.fileInfo = data.fileInfo || {};
  }

  /**
   * Add error to result
   * @param {Object} error - Error object
   */
  addError(error) {
    this.errors.push({
      rowNumber: error.rowNumber || 0,
      field: error.field || 'unknown',
      message: error.message || 'Validation error',
      value: error.value || '',
      type: error.type || 'Validation Error',
      timestamp: new Date().toISOString()
    });
    this.invalidRows++;
  }

  /**
   * Add valid row
   * @param {Object} row - Valid row data
   */
  addValidRow(row) {
    this.validData.push(row);
    this.validRows++;
  }

  /**
   * Increment total rows
   */
  incrementTotal() {
    this.totalRows++;
  }

  /**
   * Get validation summary
   * @returns {Object} Summary
   */
  getSummary() {
    return {
      fileId: this.fileId,
      fileName: this.fileName,
      country: this.country,
      totalRows: this.totalRows,
      validRows: this.validRows,
      invalidRows: this.invalidRows,
      errorRate: this.totalRows > 0 ? (this.invalidRows / this.totalRows * 100).toFixed(2) : 0,
      errorCount: this.errors.length,
      status: this.invalidRows === 0 ? 'success' : (this.validRows === 0 ? 'failed' : 'partial'),
      timestamp: this.timestamp
    };
  }

  /**
   * Get error report
   * @param {number} limit - Max errors to return
   * @returns {Array} Error list
   */
  getErrorReport(limit = 100) {
    return this.errors.slice(0, limit);
  }

  /**
   * Get valid data
   * @param {number} limit - Max rows to return
   * @returns {Array} Valid data
   */
  getValidData(limit = 1000) {
    return this.validData.slice(0, limit);
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byField: {},
      byType: {},
      topErrors: []
    };

    this.errors.forEach(error => {
      const field = error.field || 'unknown';
      const type = error.type || 'Validation Error';
      
      stats.byField[field] = (stats.byField[field] || 0) + 1;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    stats.topErrors = Object.entries(stats.byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    return stats;
  }

  /**
   * To JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      fileId: this.fileId,
      fileName: this.fileName,
      country: this.country,
      totalRows: this.totalRows,
      validRows: this.validRows,
      invalidRows: this.invalidRows,
      errors: this.errors,
      summary: this.getSummary(),
      errorStats: this.getErrorStats(),
      timestamp: this.timestamp,
      status: this.status,
      fileInfo: this.fileInfo
    };
  }

  /**
   * To CSV report
   * @returns {Array} CSV rows
   */
  toCSVReport() {
    const rows = this.errors.map(error => ({
      rowNumber: error.rowNumber || 0,
      field: error.field || 'unknown',
      errorType: error.type || 'Validation Error',
      errorMessage: error.message || 'Unknown error',
      value: error.value || '',
      timestamp: error.timestamp || new Date().toISOString()
    }));

    return rows;
  }

  /**
   * Create from JSON
   * @param {Object} json - JSON data
   * @returns {ValidationResultModel} New instance
   */
  static fromJSON(json) {
    return new ValidationResultModel({
      fileId: json.fileId,
      fileName: json.fileName,
      country: json.country,
      totalRows: json.totalRows || json.summary?.total || 0,
      validRows: json.validRows || json.summary?.valid || 0,
      invalidRows: json.invalidRows || json.summary?.invalid || 0,
      errors: json.errors || [],
      validData: json.validData || [],
      summary: json.summary || {},
      timestamp: json.timestamp,
      status: json.status,
      fileInfo: json.fileInfo
    });
  }

  /**
   * Create empty result
   * @param {string} fileId - File ID
   * @param {string} fileName - File name
   * @param {string} country - Country code
   * @returns {ValidationResultModel} New instance
   */
  static createEmpty(fileId, fileName = '', country = 'IN') {
    return new ValidationResultModel({
      fileId: fileId,
      fileName: fileName,
      country: country,
      status: 'pending'
    });
  }

  /**
   * Create from validation service result
   * @param {Object} validationResult - Validation service result
   * @param {string} fileId - File ID
   * @param {string} fileName - File name
   * @param {string} country - Country code
   * @returns {ValidationResultModel} New instance
   */
  static fromValidationResult(validationResult, fileId, fileName = '', country = 'IN') {
    const model = new ValidationResultModel({
      fileId: fileId,
      fileName: fileName,
      country: country,
      totalRows: validationResult.total || 0,
      validRows: validationResult.valid || 0,
      invalidRows: validationResult.invalid || 0,
      errors: validationResult.errors || [],
      validData: validationResult.validRows || [],
      status: validationResult.invalid === 0 ? 'success' : 'partial',
      timestamp: new Date().toISOString()
    });

    return model;
  }
}

export default ValidationResultModel;