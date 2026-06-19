import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import appConfig from '../config/appConfig.js';
import { responseUtils } from '../utils/responseUtils.js';
import { csvUtils } from '../utils/csvUtils.js';

/**
 * Format file size to human readable
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Download Controller
 * Handles file downloads for cleaned data, errors, and chunks
 */
export const downloadController = {
  /**
   * Download cleaned CSV file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadCleanedFile: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Find cleaned file
      const cleanedDir = appConfig.files.cleanedDir;
      const files = await fs.glob(path.join(cleanedDir, `${fileId}_cleaned.csv`));
      
      if (files.length === 0) {
        return responseUtils.error(res, 'Cleaned file not found', 404);
      }

      const filePath = files[0];
      const fileName = path.basename(filePath);
      
      // Set download headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', (await fs.stat(filePath)).size);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Handle stream errors
      fileStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          return responseUtils.error(res, 'Error streaming file', 500);
        }
      });

    } catch (error) {
      console.error('Download cleaned file error:', error);
      return responseUtils.error(res, 'Failed to download cleaned file', 500);
    }
  },

  /**
   * Download error report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadErrorReport: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Check if error report exists
      const reportPath = path.join(appConfig.files.reportsDir, `${fileId}_errors.csv`);
      
      if (!await fs.pathExists(reportPath)) {
        return responseUtils.error(res, 'Error report not found', 404);
      }

      const fileName = `errors_${fileId}.csv`;
      
      // Set download headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', (await fs.stat(reportPath)).size);

      // Stream the file
      const fileStream = fs.createReadStream(reportPath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          return responseUtils.error(res, 'Error streaming file', 500);
        }
      });

    } catch (error) {
      console.error('Download error report error:', error);
      return responseUtils.error(res, 'Failed to download error report', 500);
    }
  },

  /**
   * Download chunk file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadChunk: async (req, res) => {
    try {
      const { fileId, chunkIndex } = req.params;

      if (!fileId || !chunkIndex) {
        return responseUtils.error(res, 'File ID and chunk index are required', 400);
      }

      // Find chunk file
      const chunksDir = appConfig.files.chunksDir;
      const files = await fs.glob(path.join(chunksDir, `${fileId}_chunk_${chunkIndex}.csv`));
      
      if (files.length === 0) {
        return responseUtils.error(res, `Chunk ${chunkIndex} not found`, 404);
      }

      const filePath = files[0];
      const fileName = path.basename(filePath);
      
      // Set download headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', (await fs.stat(filePath)).size);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          return responseUtils.error(res, 'Error streaming file', 500);
        }
      });

    } catch (error) {
      console.error('Download chunk error:', error);
      return responseUtils.error(res, 'Failed to download chunk', 500);
    }
  },

  /**
   * Get chunk information without downloading
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getChunkInfo: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Find all chunks for this fileId
      const chunksDir = appConfig.files.chunksDir;
      const files = await fs.glob(path.join(chunksDir, `${fileId}_chunk_*.csv`));
      
      if (files.length === 0) {
        return responseUtils.success(res, {
          fileId: fileId,
          totalChunks: 0,
          chunks: [],
          message: 'No chunks found for this file'
        }, 'No chunks available');
      }

      // Get chunk info
      const chunkList = [];
      for (const file of files) {
        const stats = await fs.stat(file);
        const fileName = path.basename(file);
        const match = fileName.match(/chunk_(\d+)\.csv$/);
        const index = match ? parseInt(match[1]) : 0;
        
        chunkList.push({
          index: index,
          name: fileName,
          size: stats.size,
          sizeFormatted: formatFileSize(stats.size),
          created: stats.birthtime,
          modified: stats.mtime
        });
      }

      // Sort by index
      chunkList.sort((a, b) => a.index - b.index);

      return responseUtils.success(res, {
        fileId: fileId,
        totalChunks: chunkList.length,
        chunks: chunkList,
        downloadLinks: chunkList.map(chunk => ({
          index: chunk.index,
          url: `/api/download/chunk/${fileId}/${chunk.index}`
        }))
      }, 'Chunks retrieved successfully');

    } catch (error) {
      console.error('Get chunk info error:', error);
      return responseUtils.error(res, 'Failed to retrieve chunk information', 500);
    }
  },

  /**
   * Download all chunks as zip
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadAllChunks: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Find all chunks for this fileId
      const chunksDir = appConfig.files.chunksDir;
      const files = await fs.glob(path.join(chunksDir, `${fileId}_chunk_*.csv`));
      
      if (files.length === 0) {
        return responseUtils.error(res, 'No chunks found', 404);
      }

      // Create zip archive
      const zipName = `chunks_${fileId}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(res);

      // Add each chunk to zip
      for (const file of files) {
        const fileName = path.basename(file);
        archive.file(file, { name: fileName });
      }

      await archive.finalize();

    } catch (error) {
      console.error('Download all chunks error:', error);
      return responseUtils.error(res, 'Failed to download chunks', 500);
    }
  },

  /**
   * Download summary report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadSummary: async (req, res) => {
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

      // Read and send JSON
      const summary = await fs.readJson(summaryPath);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="summary_${fileId}.json"`);
      
      return res.json(summary);

    } catch (error) {
      console.error('Download summary error:', error);
      return responseUtils.error(res, 'Failed to download summary', 500);
    }
  },

  /**
   * Download text report
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  downloadTextReport: async (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return responseUtils.error(res, 'File ID is required', 400);
      }

      // Check if text report exists
      const reportPath = path.join(appConfig.files.reportsDir, `${fileId}_report.txt`);
      
      if (!await fs.pathExists(reportPath)) {
        return responseUtils.error(res, 'Text report not found', 404);
      }

      const fileName = `report_${fileId}.txt`;
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', (await fs.stat(reportPath)).size);

      const fileStream = fs.createReadStream(reportPath);
      fileStream.pipe(res);

    } catch (error) {
      console.error('Download text report error:', error);
      return responseUtils.error(res, 'Failed to download text report', 500);
    }
  }
};

export default downloadController;