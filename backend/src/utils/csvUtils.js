import fs from 'fs-extra';
import path from 'path';
import csv from 'csv-parser';
import { format } from 'fast-csv';
import { createWriteStream, createReadStream } from 'fs';

/**
 * CSV Utilities
 * Handles CSV reading, writing, validation, and manipulation
 */
export const csvUtils = {
  /**
   * Read CSV file and return array of objects
   */
  readCSV: (filePath, options = {}) => {
    return new Promise((resolve, reject) => {
      const results = [];
      const headers = [];

      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }

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
          headers.push(...headerList);
        })
        .on('data', (data) => {
          results.push(data);
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
   * Write array of objects to CSV file
   */
  writeCSV: (filePath, data, headers = null) => {
    return new Promise((resolve, reject) => {
      try {
        const dir = path.dirname(filePath);
        fs.ensureDirSync(dir);

        if (!data || data.length === 0) {
          const headerString = headers ? headers.join(',') + '\n' : '';
          fs.writeFileSync(filePath, headerString);
          resolve();
          return;
        }

        const ws = createWriteStream(filePath);
        const headerList = headers || Object.keys(data[0]);
        const csvStream = format({
          headers: headerList,
          writeHeaders: true
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
   * Split CSV into chunks
   */
  splitCSV: (filePath, chunkSize = 1000, outputDir, fileId) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let currentChunk = [];
      let chunkIndex = 0;
      let headers = [];
      let rowCount = 0;

      fs.ensureDirSync(outputDir);

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
          currentChunk.push(row);

          if (currentChunk.length >= chunkSize) {
            const chunkFileName = `${fileId}_chunk_${chunkIndex}.csv`;
            const chunkPath = path.join(outputDir, chunkFileName);
            
            csvUtils.writeCSV(chunkPath, currentChunk, headers)
              .then(() => {
                chunks.push(chunkPath);
              })
              .catch(error => reject(error));
            
            currentChunk = [];
            chunkIndex++;
          }
        })
        .on('end', () => {
          if (currentChunk.length > 0) {
            const chunkFileName = `${fileId}_chunk_${chunkIndex}.csv`;
            const chunkPath = path.join(outputDir, chunkFileName);
            
            csvUtils.writeCSV(chunkPath, currentChunk, headers)
              .then(() => {
                chunks.push(chunkPath);
                resolve({
                  chunks,
                  totalRows: rowCount,
                  totalChunks: chunks.length
                });
              })
              .catch(error => reject(error));
          } else {
            resolve({
              chunks,
              totalRows: rowCount,
              totalChunks: chunks.length
            });
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Get CSV headers
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
        trim: true,
        skip_empty_lines: true
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
   * Validate CSV structure
   */
  validateCSV: async (filePath, requiredColumns = []) => {
    try {
      const headers = await csvUtils.getHeaders(filePath);
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      const extraColumns = headers.filter(col => !requiredColumns.includes(col));
      
      return {
        isValid: missingColumns.length === 0,
        headers: headers,
        requiredColumns: requiredColumns,
        missingColumns: missingColumns,
        extraColumns: extraColumns,
        totalColumns: headers.length,
        hasRequiredColumns: missingColumns.length === 0
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  },

  /**
   * Get CSV row count
   */
  getRowCount: (filePath) => {
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
   * Convert CSV data to JSON
   */
  csvToJson: async (filePath) => {
    const result = await csvUtils.readCSV(filePath);
    return result.data;
  },

  /**
   * Convert JSON to CSV
   */
  jsonToCsv: async (data, filePath) => {
    await csvUtils.writeCSV(filePath, data);
  }
};

export default csvUtils;