import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * File Utilities
 * Handles file operations, validation, and management
 */
export const fileUtils = {
  /**
   * Ensure directory exists
   * @param {string} dirPath - Directory path
   * @returns {Promise<void>}
   */
  ensureDir: async (dirPath) => {
    try {
      await fs.ensureDir(dirPath);
      return true;
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      return false;
    }
  },

  /**
   * Get file extension
   * @param {string} fileName - File name
   * @returns {string} File extension (lowercase)
   */
  getFileExtension: (fileName) => {
    return path.extname(fileName).toLowerCase();
  },

  /**
   * Get file name without extension
   * @param {string} fileName - File name
   * @returns {string} File name without extension
   */
  getFileNameWithoutExtension: (fileName) => {
    return path.parse(fileName).name;
  },

  /**
   * Generate unique filename
   * @param {string} originalName - Original filename
   * @param {string} prefix - Optional prefix
   * @returns {string} Unique filename
   */
  generateUniqueFilename: (originalName, prefix = '') => {
    const ext = fileUtils.getFileExtension(originalName);
    const baseName = fileUtils.getFileNameWithoutExtension(originalName);
    const uniqueId = uuidv4().substring(0, 8);
    const timestamp = Date.now();
    return `${prefix}${baseName}_${timestamp}_${uniqueId}${ext}`;
  },

  /**
   * Check if file exists
   * @param {string} filePath - File path
   * @returns {Promise<boolean>} True if exists
   */
  fileExists: async (filePath) => {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get file size in bytes
   * @param {string} filePath - File path
   * @returns {Promise<number>} File size in bytes
   */
  getFileSize: async (filePath) => {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return -1;
    }
  },

  /**
   * Get file stats
   * @param {string} filePath - File path
   * @returns {Promise<Object>} File stats
   */
  getFileStats: async (filePath) => {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Delete file
   * @param {string} filePath - File path
   * @returns {Promise<boolean>} True if deleted
   */
  deleteFile: async (filePath) => {
    try {
      if (await fileUtils.fileExists(filePath)) {
        await fs.remove(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  },

  /**
   * Delete files with pattern
   * @param {string} dirPath - Directory path
   * @param {string} pattern - File pattern (glob)
   * @returns {Promise<number>} Number of files deleted
   */
  deleteFilesByPattern: async (dirPath, pattern) => {
    try {
      const files = await fs.glob(path.join(dirPath, pattern));
      let deleted = 0;
      for (const file of files) {
        await fs.remove(file);
        deleted++;
      }
      return deleted;
    } catch (error) {
      console.error(`Error deleting files in ${dirPath}:`, error);
      return 0;
    }
  },

  /**
   * Move file
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   * @param {Object} options - Move options
   * @returns {Promise<boolean>} True if moved
   */
  moveFile: async (source, destination, options = { overwrite: true }) => {
    try {
      await fs.move(source, destination, options);
      return true;
    } catch (error) {
      console.error(`Error moving file from ${source} to ${destination}:`, error);
      return false;
    }
  },

  /**
   * Copy file
   * @param {string} source - Source path
   * @param {string} destination - Destination path
   * @returns {Promise<boolean>} True if copied
   */
  copyFile: async (source, destination) => {
    try {
      await fs.copy(source, destination);
      return true;
    } catch (error) {
      console.error(`Error copying file from ${source} to ${destination}:`, error);
      return false;
    }
  },

  /**
   * List files in directory
   * @param {string} dirPath - Directory path
   * @param {string} pattern - Optional glob pattern
   * @returns {Promise<Array>} Array of file names
   */
  listFiles: async (dirPath, pattern = '*') => {
    try {
      if (!await fileUtils.fileExists(dirPath)) {
        return [];
      }
      const files = await fs.glob(path.join(dirPath, pattern));
      return files.map(file => path.basename(file));
    } catch (error) {
      console.error(`Error listing files in ${dirPath}:`, error);
      return [];
    }
  },

  /**
   * Get human readable file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Human readable size
   */
  getHumanReadableSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Clean old files
   * @param {string} dirPath - Directory path
   * @param {number} maxAgeDays - Maximum age in days
   * @returns {Promise<Object>} Cleanup result
   */
  cleanOldFiles: async (dirPath, maxAgeDays = 7) => {
    try {
      if (!await fileUtils.fileExists(dirPath)) {
        return { deleted: 0, freedSpace: 0 };
      }

      const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
      const now = Date.now();
      let deleted = 0;
      let freedSpace = 0;

      const files = await fs.readdir(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          const age = now - stats.mtimeMs;
          if (age > maxAgeMs) {
            freedSpace += stats.size;
            await fs.remove(filePath);
            deleted++;
          }
        }
      }

      return {
        deleted,
        freedSpace,
        freedSpaceHuman: fileUtils.getHumanReadableSize(freedSpace)
      };
    } catch (error) {
      console.error(`Error cleaning directory ${dirPath}:`, error);
      return { deleted: 0, freedSpace: 0 };
    }
  },

  /**
   * Validate file type
   * @param {string} fileName - File name
   * @param {string[]} allowedExtensions - Allowed extensions
   * @returns {boolean} True if valid
   */
  isValidFileType: (fileName, allowedExtensions = ['.csv']) => {
    const ext = fileUtils.getFileExtension(fileName);
    return allowedExtensions.includes(ext);
  },

  /**
   * Validate file size
   * @param {number} fileSize - File size in bytes
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean} True if valid
   */
  isValidFileSize: (fileSize, maxSize = 100000000) => {
    return fileSize <= maxSize;
  }
};

export default fileUtils;