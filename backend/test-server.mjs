// test-server.mjs
import app from './src/app.js';
import appConfig from './src/config/appConfig.js';

console.log('✅ App loaded successfully!');
console.log('📋 App Configuration:');
console.log('  - Port:', appConfig.server.port);
console.log('  - Environment:', appConfig.server.env);
console.log('  - Upload Directory:', appConfig.files.uploadDir);
console.log('  - Cleaned Directory:', appConfig.files.cleanedDir);
console.log('  - Chunks Directory:', appConfig.files.chunksDir);
console.log('  - Reports Directory:', appConfig.files.reportsDir);
console.log('  - Max File Size:', appConfig.files.maxFileSize);
console.log('  - Default Country:', appConfig.validation.defaultCountry);
console.log('  - Allowed Countries:', appConfig.validation.allowedCountries.join(', '));

console.log('\n✅ App is ready to start!');
console.log('Run "node server.js" to start the server.');