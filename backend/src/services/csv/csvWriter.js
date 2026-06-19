import fs from 'fs-extra';
import path from 'path';
import { format } from 'fast-csv';
import { createWriteStream } from 'fs';

/**
 * CSV Writer Service
 * Handles writing CSV files with formatting
 */
export const csvWriter = {
  /**
   * Write data to CSV file
   * @param {string} filePath - Path to write CSV
   * @param {Array} data - Array of objects
   * @param {Object} options - Write options
   * @returns {Promise<void>}
   */
  write: (filePath, data, options = {}) => {
    return new Promise((resolve, reject) => {
      try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        fs.ensureDirSync(dir);

        if (!data || data.length === 0) {
          const headers = options.headers || [];
          const headerString = headers.length > 0 ? headers.join(',') + '\n' : '';
          fs.writeFileSync(filePath, headerString);
          resolve();
          return;
        }

        const headers = options.headers || Object.keys(data[0]);
        const ws = createWriteStream(filePath);
        const csvStream = format({
          headers: headers,
          writeHeaders: options.writeHeaders !== false,
          delimiter: options.delimiter || ',',
          quote: options.quote || '"',
          escape: options.escape || '"'
        });

        csvStream.pipe(ws);

        data.forEach(row => {
          csvStream.write(row);
        });

        csvStream.end();

        ws.on('finish', () => resolve());
        ws.on('error', (error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Append data to existing CSV file
   * @param {string} filePath - Path to CSV file
   * @param {Array} data - Array of objects to append
   * @returns {Promise<void>}
   */
  append: (filePath, data) => {
    return new Promise((resolve, reject) => {
      try {
        if (!data || data.length === 0) {
          resolve();
          return;
        }

        // Check if file exists
        const fileExists = fs.existsSync(filePath);
        const headers = Object.keys(data[0]);

        const ws = createWriteStream(filePath, { flags: 'a' });
        const csvStream = format({
          headers: headers,
          writeHeaders: !fileExists,
          delimiter: ',',
          quote: '"'
        });

        csvStream.pipe(ws);

        data.forEach(row => {
          csvStream.write(row);
        });

        csvStream.end();

        ws.on('finish', () => resolve());
        ws.on('error', (error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Write CSV with custom formatting
   * @param {string} filePath - Path to write CSV
   * @param {Array} data - Array of objects
   * @param {Array} headers - Column headers
   * @param {Object} options - Formatting options
   * @returns {Promise<void>}
   */
  writeFormatted: (filePath, data, headers = null, options = {}) => {
    return csvWriter.write(filePath, data, {
      headers: headers,
      ...options
    });
  },

  /**
   * Write error report
   * @param {string} filePath - Path to write error report
   * @param {Array} errors - Array of error objects
   * @returns {Promise<void>}
   */
  writeErrorReport: (filePath, errors) => {
    const errorData = errors.map(error => ({
      rowNumber: error.rowNumber || 0,
      errorType: error.type || 'Validation Error',
      errorMessage: error.message || error.errors?.join(', ') || 'Unknown error',
      field: error.field || '',
      value: error.value || '',
      ...error.data
    }));

    return csvWriter.write(filePath, errorData, {
      headers: ['rowNumber', 'errorType', 'errorMessage', 'field', 'value']
    });
  }
};

export default csvWriter;