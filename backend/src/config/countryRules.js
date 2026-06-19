import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Country-specific validation rules
 * Each country has:
 * - name: Display name
 * - phoneValidator: Function to validate phone numbers
 * - dateFormat: Expected date format
 * - dateFormats: Array of accepted date formats for parsing
 */
export const countryRules = {
  IN: {
    name: 'India',
    code: 'IN',
    phoneValidator: (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'IN');
        if (!parsed || !parsed.isValid()) return false;
        const nationalNumber = parsed.nationalNumber.toString();
        return nationalNumber.length === 10;
      } catch (error) {
        return false;
      }
    },
    dateFormat: 'DD-MM-YYYY',
    dateFormats: ['DD-MM-YYYY', 'DD/MM/YYYY', 'DD-MM-YY', 'DD/MM/YY'],
    phoneExample: '9876543210'
  },
  
  SG: {
    name: 'Singapore',
    code: 'SG',
    phoneValidator: (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'SG');
        if (!parsed || !parsed.isValid()) return false;
        const nationalNumber = parsed.nationalNumber.toString();
        return nationalNumber.length === 8;
      } catch (error) {
        return false;
      }
    },
    dateFormat: 'DD/MM/YYYY',
    dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD/MM/YY', 'DD-MM-YY'],
    phoneExample: '91234567'
  },
  
  US: {
    name: 'United States',
    code: 'US',
    phoneValidator: (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'US');
        if (!parsed || !parsed.isValid()) return false;
        const nationalNumber = parsed.nationalNumber.toString();
        return nationalNumber.length === 10;
      } catch (error) {
        return false;
      }
    },
    dateFormat: 'MM/DD/YYYY',
    dateFormats: ['MM/DD/YYYY', 'MM-DD-YYYY', 'MM/DD/YY', 'MM-DD-YY'],
    phoneExample: '1234567890'
  },
  
  UK: {
    name: 'United Kingdom',
    code: 'GB',
    phoneValidator: (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'GB');
        if (!parsed || !parsed.isValid()) return false;
        const nationalNumber = parsed.nationalNumber.toString();
        return nationalNumber.length === 10;
      } catch (error) {
        return false;
      }
    },
    dateFormat: 'DD/MM/YYYY',
    dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD/MM/YY', 'DD-MM-YY'],
    phoneExample: '7123456789'
  },
  
  AU: {
    name: 'Australia',
    code: 'AU',
    phoneValidator: (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'AU');
        if (!parsed || !parsed.isValid()) return false;
        const nationalNumber = parsed.nationalNumber.toString();
        return nationalNumber.length === 9;
      } catch (error) {
        return false;
      }
    },
    dateFormat: 'DD/MM/YYYY',
    dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD/MM/YY', 'DD-MM-YY'],
    phoneExample: '412345678'
  },
  
  CA: {
    name: 'Canada',
    code: 'CA',
    phoneValidator: (phone) => {
      try {
        const parsed = parsePhoneNumberFromString(phone, 'CA');
        if (!parsed || !parsed.isValid()) return false;
        const nationalNumber = parsed.nationalNumber.toString();
        return nationalNumber.length === 10;
      } catch (error) {
        return false;
      }
    },
    dateFormat: 'MM/DD/YYYY',
    dateFormats: ['MM/DD/YYYY', 'MM-DD-YYYY', 'MM/DD/YY', 'MM-DD-YY'],
    phoneExample: '1234567890'
  }
};

/**
 * Get country rules by country code
 * @param {string} countryCode - Country code (IN, SG, US, etc.)
 * @returns {object} Country rules
 */
export const getCountryRules = (countryCode) => {
  const rules = countryRules[countryCode.toUpperCase()];
  if (!rules) {
    throw new Error(`Country ${countryCode} not supported`);
  }
  return rules;
};

/**
 * Get all supported country codes
 * @returns {string[]} Array of country codes
 */
export const getSupportedCountries = () => {
  return Object.keys(countryRules);
};

/**
 * Validate phone number for a specific country
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code
 * @returns {boolean} True if valid
 */
export const validatePhoneForCountry = (phone, countryCode) => {
  const rules = getCountryRules(countryCode);
  return rules.phoneValidator(phone);
};

/**
 * Get phone number example for a country
 * @param {string} countryCode - Country code
 * @returns {string} Example phone number
 */
export const getPhoneExample = (countryCode) => {
  const rules = getCountryRules(countryCode);
  return rules.phoneExample;
};