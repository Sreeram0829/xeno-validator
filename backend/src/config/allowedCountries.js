import { countryRules } from './countryRules.js';

/**
 * Allowed countries configuration
 * This file manages the list of supported countries
 * and provides utility functions for country operations
 */

// Get all supported countries from countryRules
const supportedCountries = Object.keys(countryRules);

/**
 * Allowed countries with metadata
 */
export const allowedCountries = supportedCountries.map(code => ({
  code: code,
  name: countryRules[code].name,
  phoneExample: countryRules[code].phoneExample,
  dateFormat: countryRules[code].dateFormat
}));

/**
 * Country display names mapping
 */
export const countryDisplayNames = {
  IN: 'India',
  SG: 'Singapore',
  US: 'United States',
  UK: 'United Kingdom',
  AU: 'Australia',
  CA: 'Canada'
};

/**
 * Get country by code
 * @param {string} code - Country code
 * @returns {object|null} Country object or null if not found
 */
export const getCountryByCode = (code) => {
  const upperCode = code.toUpperCase();
  const country = allowedCountries.find(c => c.code === upperCode);
  return country || null;
};

/**
 * Check if a country is allowed
 * @param {string} code - Country code
 * @returns {boolean} True if allowed
 */
export const isCountryAllowed = (code) => {
  return allowedCountries.some(c => c.code === code.toUpperCase());
};

/**
 * Get country name by code
 * @param {string} code - Country code
 * @returns {string} Country name or the code itself if not found
 */
export const getCountryName = (code) => {
  const country = getCountryByCode(code);
  return country ? country.name : code;
};

/**
 * Get default country
 * @returns {object} Default country object
 */
export const getDefaultCountry = () => {
  const defaultCode = 'IN';
  return getCountryByCode(defaultCode) || allowedCountries[0];
};

/**
 * Get all country codes
 * @returns {string[]} Array of country codes
 */
export const getAllCountryCodes = () => {
  return allowedCountries.map(c => c.code);
};

/**
 * Get countries as select options
 * @returns {Array<{value: string, label: string}>} Options for select dropdown
 */
export const getCountrySelectOptions = () => {
  return allowedCountries.map(country => ({
    value: country.code,
    label: `${country.name} (${country.code})`
  }));
};

/**
 * Validate country code
 * @param {string} code - Country code to validate
 * @returns {boolean} True if valid
 */
export const isValidCountryCode = (code) => {
  return isCountryAllowed(code);
};

/**
 * Get country rules for a specific country
 * @param {string} code - Country code
 * @returns {object|null} Country rules or null
 */
export const getCountryRulesByCode = (code) => {
  const upperCode = code.toUpperCase();
  return countryRules[upperCode] || null;
};

// Export default configuration
export default {
  allowedCountries,
  getCountryByCode,
  isCountryAllowed,
  getCountryName,
  getDefaultCountry,
  getAllCountryCodes,
  getCountrySelectOptions,
  isValidCountryCode,
  getCountryRulesByCode,
  countryDisplayNames
};