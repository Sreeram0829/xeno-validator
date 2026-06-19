import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import appConfig from '../config/appConfig.js';
import { responseUtils } from '../utils/responseUtils.js';
import { fileUtils } from '../utils/fileUtils.js';

/**
 * Status Controller
 * Handles system status, health checks, and monitoring
 */
export const statusController = {
  /**
   * Health check endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  healthCheck: async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
          used: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
          total: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2),
          rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2)
        },
        system: {
          platform: os.platform(),
          release: os.release(),
          cpus: os.cpus().length,
          totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB'
        }
      };

      return responseUtils.success(res, health, 'System is healthy');
    } catch (error) {
      console.error('Health check error:', error);
      return responseUtils.error(res, 'Health check failed', 500);
    }
  },

  /**
   * Get system status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSystemStatus: async (req, res) => {
    try {
      // Check directories
      const directories = {
        uploads: await fs.pathExists(appConfig.files.uploadDir),
        cleaned: await fs.pathExists(appConfig.files.cleanedDir),
        chunks: await fs.pathExists(appConfig.files.chunksDir),
        reports: await fs.pathExists(appConfig.files.reportsDir)
      };

      // Count files in each directory
      const fileCounts = {};
      const directorySizes = {};
      
      for (const [key, dir] of Object.entries({
        uploads: appConfig.files.uploadDir,
        cleaned: appConfig.files.cleanedDir,
        chunks: appConfig.files.chunksDir,
        reports: appConfig.files.reportsDir
      })) {
        if (await fs.pathExists(dir)) {
          const files = await fs.readdir(dir);
          fileCounts[key] = files.length;
          
          // Calculate directory size
          let size = 0;
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
              size += stats.size;
            }
          }
          directorySizes[key] = size;
        } else {
          fileCounts[key] = 0;
          directorySizes[key] = 0;
        }
      }

      const status = {
        server: {
          status: 'running',
          port: appConfig.server.port,
          environment: appConfig.server.env,
          uptime: process.uptime(),
          nodeVersion: process.version
        },
        directories: {
          exists: directories,
          fileCounts: fileCounts,
          sizes: {
            uploads: fileUtils.getHumanReadableSize(directorySizes.uploads),
            cleaned: fileUtils.getHumanReadableSize(directorySizes.cleaned),
            chunks: fileUtils.getHumanReadableSize(directorySizes.chunks),
            reports: fileUtils.getHumanReadableSize(directorySizes.reports)
          }
        },
        validation: {
          defaultCountry: appConfig.validation.defaultCountry,
          allowedCountries: appConfig.validation.allowedCountries,
          chunkSize: appConfig.files.chunkSize,
          maxFileSize: fileUtils.getHumanReadableSize(appConfig.files.maxFileSize)
        },
        timestamp: new Date().toISOString()
      };

      return responseUtils.success(res, status, 'System status retrieved successfully');
    } catch (error) {
      console.error('Get system status error:', error);
      return responseUtils.error(res, 'Failed to get system status', 500);
    }
  },

  /**
   * Get file processing statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getStats: async (req, res) => {
    try {
      const reportsDir = appConfig.files.reportsDir;
      
      if (!await fs.pathExists(reportsDir)) {
        return responseUtils.success(res, {
          totalFiles: 0,
          totalRows: 0,
          totalErrors: 0,
          averageErrorRate: 0,
          processedCountries: {}
        }, 'No statistics available');
      }

      // Read all summary reports
      const files = await fs.glob(path.join(reportsDir, '*_summary.json'));
      let totalRows = 0;
      let totalErrors = 0;
      let fileCount = 0;
      const countries = {};

      for (const file of files) {
        try {
          const data = await fs.readJson(file);
          if (data.summary) {
            totalRows += data.summary.total || 0;
            totalErrors += data.summary.invalid || 0;
            fileCount++;
            
            const country = data.country || 'unknown';
            countries[country] = (countries[country] || 0) + 1;
          }
        } catch (error) {
          console.error('Error reading summary file:', error);
        }
      }

      const stats = {
        totalFiles: fileCount,
        totalRows: totalRows,
        totalErrors: totalErrors,
        averageErrorRate: totalRows > 0 ? (totalErrors / totalRows * 100).toFixed(2) : 0,
        processedCountries: countries,
        timestamp: new Date().toISOString()
      };

      return responseUtils.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      console.error('Get stats error:', error);
      return responseUtils.error(res, 'Failed to get statistics', 500);
    }
  },

  /**
   * Clear old files (cleanup)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  cleanup: async (req, res) => {
    try {
      const { days = 7 } = req.query;
      const maxAge = parseInt(days) * 24 * 60 * 60 * 1000;
      const now = Date.now();

      const directories = [
        appConfig.files.uploadDir,
        appConfig.files.cleanedDir,
        appConfig.files.chunksDir,
        appConfig.files.reportsDir
      ];

      let deletedCount = 0;
      let totalSize = 0;

      for (const dir of directories) {
        if (!await fs.pathExists(dir)) continue;

        const files = await fs.readdir(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.isFile()) {
            const age = now - stats.mtimeMs;
            if (age > maxAge) {
              totalSize += stats.size;
              await fs.remove(filePath);
              deletedCount++;
            }
          }
        }
      }

      return responseUtils.success(res, {
        deletedFiles: deletedCount,
        freedSpace: fileUtils.getHumanReadableSize(totalSize),
        freedSpaceBytes: totalSize,
        maxAge: `${days} days`
      }, 'Cleanup completed successfully');
    } catch (error) {
      console.error('Cleanup error:', error);
      return responseUtils.error(res, 'Failed to cleanup files', 500);
    }
  },

  /**
   * Get processing queue status (placeholder for future implementation)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getQueueStatus: async (req, res) => {
    return responseUtils.success(res, {
      status: 'idle',
      pendingJobs: 0,
      processingJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      queueType: 'synchronous'
    }, 'Queue status retrieved successfully');
  },

  /**
   * Get server information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getServerInfo: async (req, res) => {
    try {
      const info = {
        name: 'Xeno Transaction Validator API',
        version: '1.0.0',
        environment: appConfig.server.env,
        nodeVersion: process.version,
        platform: os.platform(),
        architecture: os.arch(),
        uptime: process.uptime(),
        startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
        memory: {
          total: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          free: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          processUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB'
        },
        endpoints: {
          health: '/api/health',
          status: '/api/status',
          stats: '/api/stats',
          upload: '/api/upload',
          download: '/api/download/:fileId',
          validation: '/api/validation/:fileId'
        }
      };

      return responseUtils.success(res, info, 'Server info retrieved successfully');
    } catch (error) {
      console.error('Get server info error:', error);
      return responseUtils.error(res, 'Failed to get server info', 500);
    }
  }
};

export default statusController;