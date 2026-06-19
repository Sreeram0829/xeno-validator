import fs from 'fs-extra';
import path from 'path';
import pkg from 'csv-parser';
import { format } from 'fast-csv';
import { createWriteStream, createReadStream } from 'fs';
import { csvReader } from './csvReader.js';
import { csvWriter } from './csvWriter.js';

const { parse } = pkg;

/**
 * CSV Chunker Service
 * Splits large CSV files into smaller chunks
 */
export const csvChunker = {
  /**
   * Split CSV file into chunks
   * @param {string} filePath - Path to CSV file
   * @param {number} chunkSize - Rows per chunk
   * @param {string} outputDir - Output directory
   * @param {string} baseName - Base name for chunks
   * @returns {Promise<Object>} { chunks, totalRows, totalChunks }
   */
  split: (filePath, chunkSize = 1000, outputDir, baseName = 'chunk') => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let currentChunk = [];
      let chunkIndex = 1;
      let headers = [];
      let totalRows = 0;

      // Ensure output directory exists
      fs.ensureDirSync(outputDir);

      const readStream = createReadStream(filePath);
      
      readStream
        .pipe(parse({
          columns: true,
          trim: true,
          skip_empty_lines: true
        }))
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', (row) => {
          totalRows++;
          currentChunk.push(row);

          if (currentChunk.length >= chunkSize) {
            const chunkFileName = `${baseName}_${chunkIndex}.csv`;
            const chunkPath = path.join(outputDir, chunkFileName);
            
            // Write chunk
            csvWriter.write(chunkPath, currentChunk, { headers })
              .then(() => {
                chunks.push({
                  index: chunkIndex,
                  path: chunkPath,
                  size: currentChunk.length
                });
              })
              .catch(error => reject(error));
            
            currentChunk = [];
            chunkIndex++;
          }
        })
        .on('end', () => {
          // Write remaining rows
          if (currentChunk.length > 0) {
            const chunkFileName = `${baseName}_${chunkIndex}.csv`;
            const chunkPath = path.join(outputDir, chunkFileName);
            
            csvWriter.write(chunkPath, currentChunk, { headers })
              .then(() => {
                chunks.push({
                  index: chunkIndex,
                  path: chunkPath,
                  size: currentChunk.length
                });
                
                resolve({
                  chunks,
                  totalRows,
                  totalChunks: chunks.length,
                  chunkSize
                });
              })
              .catch(error => reject(error));
          } else {
            resolve({
              chunks,
              totalRows,
              totalChunks: chunks.length,
              chunkSize
            });
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Split CSV with progress callback
   * @param {string} filePath - Path to CSV file
   * @param {number} chunkSize - Rows per chunk
   * @param {string} outputDir - Output directory
   * @param {string} baseName - Base name for chunks
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>}
   */
  splitWithProgress: (filePath, chunkSize = 1000, outputDir, baseName = 'chunk', onProgress = null) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let currentChunk = [];
      let chunkIndex = 1;
      let headers = [];
      let totalRows = 0;
      let processedRows = 0;

      fs.ensureDirSync(outputDir);

      const readStream = createReadStream(filePath);
      
      readStream
        .pipe(parse({
          columns: true,
          trim: true,
          skip_empty_lines: true
        }))
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', (row) => {
          totalRows++;
          processedRows++;
          currentChunk.push(row);

          if (onProgress) {
            onProgress({
              processed: processedRows,
              total: totalRows,
              percentage: (processedRows / totalRows * 100)
            });
          }

          if (currentChunk.length >= chunkSize) {
            const chunkFileName = `${baseName}_${chunkIndex}.csv`;
            const chunkPath = path.join(outputDir, chunkFileName);
            
            csvWriter.write(chunkPath, currentChunk, { headers })
              .then(() => {
                chunks.push({
                  index: chunkIndex,
                  path: chunkPath,
                  size: currentChunk.length
                });
              })
              .catch(error => reject(error));
            
            currentChunk = [];
            chunkIndex++;
          }
        })
        .on('end', () => {
          if (currentChunk.length > 0) {
            const chunkFileName = `${baseName}_${chunkIndex}.csv`;
            const chunkPath = path.join(outputDir, chunkFileName);
            
            csvWriter.write(chunkPath, currentChunk, { headers })
              .then(() => {
                chunks.push({
                  index: chunkIndex,
                  path: chunkPath,
                  size: currentChunk.length
                });
                
                resolve({
                  chunks,
                  totalRows,
                  totalChunks: chunks.length,
                  chunkSize
                });
              })
              .catch(error => reject(error));
          } else {
            resolve({
              chunks,
              totalRows,
              totalChunks: chunks.length,
              chunkSize
            });
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },

  /**
   * Merge chunks back into single CSV
   * @param {Array} chunkPaths - Array of chunk file paths
   * @param {string} outputPath - Output file path
   * @returns {Promise<void>}
   */
  merge: (chunkPaths, outputPath) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!chunkPaths || chunkPaths.length === 0) {
          reject(new Error('No chunks to merge'));
          return;
        }

        let headers = [];
        let allData = [];

        for (const chunkPath of chunkPaths) {
          const result = await csvReader.read(chunkPath);
          if (headers.length === 0) {
            headers = result.headers;
          }
          allData = allData.concat(result.data);
        }

        await csvWriter.write(outputPath, allData, { headers });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Get chunk information
   * @param {string} chunkDir - Directory containing chunks
   * @param {string} baseName - Base name of chunks
   * @returns {Promise<Array>} Array of chunk info
   */
  getChunkInfo: async (chunkDir, baseName = 'chunk') => {
    try {
      const files = await fs.readdir(chunkDir);
      const chunkFiles = files
        .filter(file => file.startsWith(`${baseName}_`) && file.endsWith('.csv'))
        .sort();

      const chunkInfo = [];
      for (const file of chunkFiles) {
        const filePath = path.join(chunkDir, file);
        const stats = await fs.stat(filePath);
        const rows = await csvReader.countRows(filePath);
        
        chunkInfo.push({
          fileName: file,
          path: filePath,
          size: stats.size,
          rows: rows,
          created: stats.birthtime
        });
      }

      return chunkInfo;
    } catch (error) {
      console.error('Error getting chunk info:', error);
      return [];
    }
  }
};

export default csvChunker;