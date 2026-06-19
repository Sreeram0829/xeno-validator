import { parse, isValid, format, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

/**
 * Date Utilities
 * Handles date parsing, formatting, and validation
 */
export const dateUtils = {
  /**
   * Parse date string using multiple formats
   * @param {string} dateString - Date string to parse
   * @param {string[]} formats - Array of date formats to try
   * @returns {Date|null} Parsed date or null
   */
  parseDate: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY', 'DD-MM-YY']) => {
    if (!dateString) return null;
    
    const trimmedDate = dateString.trim();
    
    for (const formatStr of formats) {
      try {
        const parsed = parse(trimmedDate, formatStr, new Date());
        if (isValid(parsed)) {
          return parsed;
        }
      } catch (error) {
        // Continue to next format
      }
    }
    return null;
  },

  /**
   * Validate if a date string is valid
   * @param {string} dateString - Date string to validate
   * @param {string[]} formats - Array of date formats to try
   * @returns {boolean} True if valid
   */
  isValidDate: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']) => {
    const parsed = dateUtils.parseDate(dateString, formats);
    return parsed !== null && isValid(parsed);
  },

  /**
   * Format a date to string
   * @param {Date} date - Date object
   * @param {string} formatStr - Format string
   * @returns {string} Formatted date string
   */
  formatDate: (date, formatStr = 'DD-MM-YYYY') => {
    if (!date || !isValid(date)) return '';
    try {
      return format(date, formatStr);
    } catch (error) {
      return '';
    }
  },

  /**
   * Get date difference in days
   * @param {Date|string} date1 - First date
   * @param {Date} date2 - Second date (default: now)
   * @returns {number} Difference in days
   */
  daysDifference: (date1, date2 = new Date()) => {
    const d1 = typeof date1 === 'string' ? dateUtils.parseDate(date1) : new Date(date1);
    const d2 = new Date(date2);
    if (!d1 || !isValid(d1)) return -1;
    return Math.abs(differenceInDays(d2, d1));
  },

  /**
   * Check if date is in the last N days
   * @param {string} dateString - Date string to check
   * @param {number} days - Number of days
   * @param {string[]} formats - Date formats to try
   * @returns {boolean} True if date is within last N days
   */
  isInLastDays: (dateString, days = 30, formats = ['DD-MM-YYYY', 'MM/DD/YYYY']) => {
    const date = dateUtils.parseDate(dateString, formats);
    if (!date) return false;
    const diff = dateUtils.daysDifference(date);
    return diff <= days;
  },

  /**
   * Get month name from date
   * @param {string} dateString - Date string
   * @param {string[]} formats - Date formats to try
   * @returns {string} Month name
   */
  getMonthName: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY']) => {
    const date = dateUtils.parseDate(dateString, formats);
    if (!date) return '';
    return format(date, 'MMMM');
  },

  /**
   * Get month number from date
   * @param {string} dateString - Date string
   * @param {string[]} formats - Date formats to try
   * @returns {number} Month number (1-12)
   */
  getMonthNumber: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY']) => {
    const date = dateUtils.parseDate(dateString, formats);
    if (!date) return -1;
    return parseInt(format(date, 'MM'));
  },

  /**
   * Get day of week from date
   * @param {string} dateString - Date string
   * @param {string[]} formats - Date formats to try
   * @returns {string} Day of week name
   */
  getDayOfWeek: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY']) => {
    const date = dateUtils.parseDate(dateString, formats);
    if (!date) return '';
    return format(date, 'EEEE');
  },

  /**
   * Get day of week number (0-6, Sunday=0)
   * @param {string} dateString - Date string
   * @param {string[]} formats - Date formats to try
   * @returns {number} Day of week number
   */
  getDayOfWeekNumber: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY']) => {
    const date = dateUtils.parseDate(dateString, formats);
    if (!date) return -1;
    return parseInt(format(date, 'd'));
  },

  /**
   * Get current date in specific format
   * @param {string} formatStr - Format string
   * @returns {string} Formatted current date
   */
  getCurrentDate: (formatStr = 'DD-MM-YYYY') => {
    return dateUtils.formatDate(new Date(), formatStr);
  },

  /**
   * Get year from date
   * @param {string} dateString - Date string
   * @param {string[]} formats - Date formats to try
   * @returns {number} Year
   */
  getYear: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY']) => {
    const date = dateUtils.parseDate(dateString, formats);
    if (!date) return -1;
    return parseInt(format(date, 'yyyy'));
  },

  /**
   * Check if two dates are the same day
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {boolean} True if same day
   */
  isSameDay: (date1, date2) => {
    const d1 = typeof date1 === 'string' ? dateUtils.parseDate(date1) : new Date(date1);
    const d2 = typeof date2 === 'string' ? dateUtils.parseDate(date2) : new Date(date2);
    if (!d1 || !d2 || !isValid(d1) || !isValid(d2)) return false;
    return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
  },

  /**
   * Get date range between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} Days between
   */
  getDateRange: (startDate, endDate) => {
    const d1 = typeof startDate === 'string' ? dateUtils.parseDate(startDate) : new Date(startDate);
    const d2 = typeof endDate === 'string' ? dateUtils.parseDate(endDate) : new Date(endDate);
    if (!d1 || !d2 || !isValid(d1) || !isValid(d2)) return -1;
    return differenceInDays(d2, d1);
  }
};

export default dateUtils;