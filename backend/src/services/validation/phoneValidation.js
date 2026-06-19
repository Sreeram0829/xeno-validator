/**
 * Phone Validation Service - Simplified
 */
export const phoneValidation = {
  validate: (phone, countryCode = 'IN') => {
    try {
      if (!phone || phone.toString().trim() === '') {
        return {
          isValid: true, // Phone is optional
          parsed: null,
          error: null
        };
      }

      const phoneStr = phone.toString().trim();
      // Remove spaces, dashes, parentheses
      const cleaned = phoneStr.replace(/[\s\-()]/g, '');
      
      // Check if it contains only digits
      if (!/^\d+$/.test(cleaned)) {
        return {
          isValid: false,
          parsed: null,
          error: 'Phone number contains invalid characters'
        };
      }

      // Country-specific validation
      const countryRules = {
        IN: { length: 10, pattern: /^[6-9]\d{9}$/ },
        SG: { length: 8, pattern: /^\d{8}$/ },
        US: { length: 10, pattern: /^\d{10}$/ },
        UK: { length: 10, pattern: /^\d{10}$/ },
        AU: { length: 9, pattern: /^\d{9}$/ },
        CA: { length: 10, pattern: /^\d{10}$/ }
      };

      const rule = countryRules[countryCode.toUpperCase()];
      
      if (rule) {
        if (cleaned.length !== rule.length) {
          return {
            isValid: false,
            parsed: null,
            error: `Phone number must be ${rule.length} digits for ${countryCode}`
          };
        }
        if (!rule.pattern.test(cleaned)) {
          return {
            isValid: false,
            parsed: null,
            error: `Invalid phone number format for ${countryCode}`
          };
        }
      }

      return {
        isValid: true,
        parsed: { nationalNumber: cleaned },
        error: null,
        formatted: phoneStr
      };
    } catch (error) {
      return {
        isValid: false,
        parsed: null,
        error: error.message || 'Phone validation failed'
      };
    }
  },

  isValid: (phone, countryCode = 'IN') => {
    const result = phoneValidation.validate(phone, countryCode);
    return result.isValid;
  }
};

export default phoneValidation;