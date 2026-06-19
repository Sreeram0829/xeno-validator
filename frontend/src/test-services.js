// test-services.js - Run with Node
import { uploadService } from './services/uploadService.js';
import { downloadService } from './services/downloadService.js';

console.log('✅ Services loaded successfully!');
console.log('📋 Upload Service:', Object.keys(uploadService));
console.log('📋 Download Service:', Object.keys(downloadService));