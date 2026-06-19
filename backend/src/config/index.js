export * from './countryRules.js';
export * from './appConfig.js';
export * from './allowedCountries.js';

import appConfig from './appConfig.js';
import allowedCountriesConfig from './allowedCountries.js';
import { countryRules } from './countryRules.js';

export default {
  appConfig,
  allowedCountries: allowedCountriesConfig,
  countryRules
};