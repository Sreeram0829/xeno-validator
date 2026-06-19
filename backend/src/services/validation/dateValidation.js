import { parse, isValid, format, differenceInDays, isAfter, isBefore, isEqual } from 'date-fns';
import { dateUtils } from '../../utils/dateUtils.js';

/**
 * Date Validation Service
 * Handles date validation, parsing, and formatting
 */
export const dateValidation = {
  /**
   * Validate date string
   * @param {string} dateString - Date string to validate
   * @param {Array} formats - Accepted date formats
   * @param {Object} options - Validation options
   * @returns {Object} { isValid, parsed, error }
   */
  validate: (dateString, formats = ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'], options = {}) => {
    try {
      if (!dateString || dateString.trim() === '') {
        return {
          isValid: false,
          parsed: null,
          error: 'Date is required'
        };
      }

      const trimmedDate = dateString.trim();
      let parsedDate = null;
      let usedFormat = null;

      for (const formatStr of formats) {
        try {
          const parsed = parse(trimmedDate, formatStr, new Date());
          if (isValid(parsed)) {
            parsedDate = parsed;
            usedFormat = formatStr;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      if (!parsedDate || !isValid(parsedDate)) {
        return {
          isValid: false,
          parsed: null,
          error: `Invalid date format. Expected one of: ${formats.join(', ')}`
        };
      }

      // Check date range if options provided
      if (options.minDate) {
        const minDate = typeof options.minDate === 'string' 
          ? dateUtils.parseDate(options.minDate, formats) 
          : new Date(options.minDate);
        if (minDate && isBefore(parsedDate, minDate)) {
          return {
            isValid: false,
            parsed: parsedDate,
            error: `Date must be after ${format(minDate, 'DD-MM-YYYY')}`
          };
        }
      }

      if (options.maxDate) {
        const maxDate = typeof options.maxDate === 'string' 
          ? dateUtils.parseDate(options.maxDate, formats) 
          : new Date(options.maxDate);
        if (maxDate && isAfter(parsedDate, maxDate)) {
          return {
            isValid: false,
            parsed: parsedDate,
            error: `Date must be before ${format(maxDate, 'DD-MM-YYYY')}`
          };
        }
      }

      return {
        isValid: true,
        parsed: parsedDate,
        error: null,
        format: usedFormat,
        formatted: format(parsedDate, 'DD-MM-YYYY'),
        day: format(parsedDate, 'd'),
        month: format(parsedDate, 'MMMM'),
        monthNumber: parseInt(format(parsedDate, 'MM')),
        year: parseInt(format(parsedDate, 'yyyy')),
        dayOfWeek: format(parsedDate, 'EEEE')
      };
    } catch (error) {
      return {
        isValid: false,
        parsed: null,
        error: error.message || 'Date validation failed'
      };
    }
  },

  /**
   * Check if date is in the last N days
   * @param {string} dateString - Date string
   * @param {number} days - Number of days
   * @param {Array} formats - Date formats
   * @returns {boolean} True if in last N days
   */
  isInLastDays: (dateString, days = 30, formats = ['DD-MM-YYYY']) => {
    const result = dateValidation.validate(dateString, formats);
    if (!result.isValid) return false;
    const diff = differenceInDays(new Date(), result.parsed);
    return diff <= days && diff >= 0;
  },

  /**
   * Check if date is in the future
   * @param {string} dateString - Date string
   * @param {Array} formats - Date formats
   * @returns {boolean} True if in future
   */
  isFuture: (dateString, formats = ['DD-MM-YYYY']) => {
    const result = dateValidation.validate(dateString, formats);
    if (!result.isValid) return false;
    return isAfter(result.parsed, new Date());
  },

  /**
   * Check if date is in the past
   * @param {string} dateString - Date string
   * @param {Array} formats - Date formats
   * @returns {boolean} True if in past
   */
  isPast: (dateString, formats = ['DD-MM-YYYY']) => {
    const result = dateValidation.validate(dateString, formats);
    if (!result.isValid) return false;
    return isBefore(result.parsed, new Date());
  },

  /**
   * Get date difference in days
   * @param {string} date1 - First date
   * @param {string} date2 - Second date
   * @param {Array} formats - Date formats
   * @returns {number} Difference in days
   */
  differenceInDays: (date1, date2, formats = ['DD-MM-YYYY']) => {
    const result1 = dateValidation.validate(date1, formats);
    const result2 = dateValidation.validate(date2, formats);
    if (!result1.isValid || !result2.isValid) return -1;
    return Math.abs(differenceInDays(result2.parsed, result1.parsed));
  },

  /**
   * Validate date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {Array} formats - Date formats
   * @returns {Object} { isValid, error }
   */
  validateRange: (startDate, endDate, formats = ['DD-MM-YYYY']) => {
    const startResult = dateValidation.validate(startDate, formats);
    const endResult = dateValidation.validate(endDate, formats);

    if (!startResult.isValid) {
      return { isValid: false, error: 'Invalid start date' };
    }

    if (!endResult.isValid) {
      return { isValid: false, error: 'Invalid end date' };
    }

    if (isAfter(startResult.parsed, endResult.parsed)) {
      return { isValid: false, error: 'Start date must be before end date' };
    }

    return { isValid: true, error: null };
  }
};

export default dateValidation;