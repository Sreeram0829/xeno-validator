// test-config.mjs - Correct ES Module syntax
import appConfig from './src/config/appConfig.js';
import { countryRules, getSupportedCountries } from './src/config/countryRules.js';
import { allowedCountries, getCountrySelectOptions, getDefaultCountry } from './src/config/allowedCountries.js';

console.log('✅ App Config loaded successfully!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📡 Server Configuration:');
console.log('  Port:', appConfig.server.port);
console.log('  Environment:', appConfig.server.env);
console.log('  Is Production:', appConfig.server.isProduction);
console.log('  Is Development:', appConfig.server.isDevelopment);

console.log('\n📁 File Configuration:');
console.log('  Max File Size:', appConfig.files.maxFileSize, 'bytes');
console.log('  Upload Directory:', appConfig.files.uploadDir);
console.log('  Cleaned Directory:', appConfig.files.cleanedDir);
console.log('  Chunks Directory:', appConfig.files.chunksDir);
console.log('  Reports Directory:', appConfig.files.reportsDir);
console.log('  Chunk Size:', appConfig.files.chunkSize, 'rows');

console.log('\n✅ Supported Countries:', getSupportedCountries());
console.log('\n🌍 Country Select Options:');
getCountrySelectOptions().forEach(option => {
  console.log(`  ${option.value}: ${option.label}`);
});

console.log('\n📋 Default Country:', getDefaultCountry());

console.log('\n🔍 Country Rules for India:');
console.log('  Name:', countryRules.IN.name);
console.log('  Code:', countryRules.IN.code);
console.log('  Date Format:', countryRules.IN.dateFormat);
console.log('  Phone Example:', countryRules.IN.phoneExample);
console.log('  Accepted Date Formats:', countryRules.IN.dateFormats.join(', '));

console.log('\n🔍 Country Rules for Singapore:');
console.log('  Name:', countryRules.SG.name);
console.log('  Code:', countryRules.SG.code);
console.log('  Date Format:', countryRules.SG.dateFormat);
console.log('  Phone Example:', countryRules.SG.phoneExample);

console.log('\n✅ All configurations loaded successfully!');