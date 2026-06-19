import fs from 'fs-extra';
import csv from 'csv-parser';

/**
 * CSV Reader Service
 * Handles reading CSV files with streaming
 */
export const csvReader = {
  /**
   * Read CSV file with streaming
   */
  read: (filePath, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }

      const results = [];
      let headers = [];

      const readStream = fs.createReadStream(filePath);
      const parser = csv({
        columns: true,
        trim: true,
        skip_empty_lines: true,
        ...options
      });

      readStream
        .pipe(parser)
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          resolve({
            headers,
            data: results,
            count: results.length
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Read CSV file line by line (streaming)
   */
  readStream: (filePath, onRow, onComplete, onError) => {
    if (!fs.existsSync(filePath)) {
      onError(new Error(`File not found: ${filePath}`));
      return;
    }

    let headers = [];
    let rowCount = 0;

    const readStream = fs.createReadStream(filePath);
    const parser = csv({
      columns: true,
      trim: true,
      skip_empty_lines: true
    });

    readStream
      .pipe(parser)
      .on('headers', (headerList) => {
        headers = headerList;
      })
      .on('data', (row) => {
        rowCount++;
        onRow(row, rowCount, headers);
      })
      .on('end', () => {
        onComplete({
          totalRows: rowCount,
          headers: headers
        });
      })
      .on('error', (error) => {
        onError(error);
      });
  },

  /**
   * Get CSV headers only
   */
  getHeaders: (filePath) => {
    return new Promise((resolve, reject) => {
      let headers = [];

      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }

      const readStream = fs.createReadStream(filePath);
      const parser = csv({
        columns: true,
        trim: true
      });

      readStream
        .pipe(parser)
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', () => {
          readStream.destroy();
        })
        .on('close', () => {
          resolve(headers);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Count rows in CSV
   */
  countRows: (filePath) => {
    return new Promise((resolve, reject) => {
      let count = 0;

      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }

      const readStream = fs.createReadStream(filePath);
      const parser = csv({
        columns: true,
        trim: true,
        skip_empty_lines: true
      });

      readStream
        .pipe(parser)
        .on('data', () => {
          count++;
        })
        .on('end', () => {
          resolve(count);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Get first N rows from CSV
   */
  readFirstRows: (filePath, limit = 10) => {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }

      const results = [];
      let headers = [];
      let rowCount = 0;

      const readStream = fs.createReadStream(filePath);
      const parser = csv({
        columns: true,
        trim: true,
        skip_empty_lines: true
      });

      readStream
        .pipe(parser)
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', (row) => {
          if (rowCount < limit) {
            results.push(row);
            rowCount++;
          } else {
            readStream.destroy();
          }
        })
        .on('close', () => {
          resolve({
            headers,
            data: results,
            count: results.length
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Validate CSV structure
   */
  validateStructure: async (filePath, requiredColumns = []) => {
    try {
      const headers = await csvReader.getHeaders(filePath);
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      return {
        isValid: missingColumns.length === 0,
        headers: headers,
        missingColumns: missingColumns,
        totalColumns: headers.length
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  },

  /**
   * Get CSV file info
   */
  getFileInfo: async (filePath) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const stats = await fs.stat(filePath);
      const headers = await csvReader.getHeaders(filePath);
      const rowCount = await csvReader.countRows(filePath);

      return {
        fileName: path.basename(filePath),
        fileSize: stats.size,
        fileSizeFormatted: csvReader.formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        headers: headers,
        rowCount: rowCount,
        columnCount: headers.length
      };
    } catch (error) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  },

  /**
   * Format file size to human readable
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

export default csvReader;