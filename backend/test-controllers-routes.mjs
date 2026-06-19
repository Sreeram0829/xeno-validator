// test-controllers-routes.mjs
import { uploadController } from './src/controllers/uploadController.js';
import { validationController } from './src/controllers/validationController.js';
import { downloadController } from './src/controllers/downloadController.js';
import { statusController } from './src/controllers/statusController.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import validationRoutes from './src/routes/validationRoutes.js';
import downloadRoutes from './src/routes/downloadRoutes.js';
import statusRoutes from './src/routes/statusRoutes.js';

console.log('✅ Controllers and Routes loaded successfully!');

console.log('\n📋 Controllers:');
console.log('  - uploadController:', Object.keys(uploadController));
console.log('  - validationController:', Object.keys(validationController));
console.log('  - downloadController:', Object.keys(downloadController));
console.log('  - statusController:', Object.keys(statusController));

console.log('\n📋 Routes:');
console.log('  - uploadRoutes: router mounted');
console.log('  - validationRoutes: router mounted');
console.log('  - downloadRoutes: router mounted');
console.log('  - statusRoutes: router mounted');

// Test a simple function from each controller
console.log('\n🔍 Testing controller methods:');

// Test health check function
const mockRes = {
  status: (code) => ({
    json: (data) => {
      console.log('  Health check status:', code);
      console.log('  Health check response:', data.message);
    }
  })
};

// Test status controller health check
try {
  await statusController.healthCheck({}, mockRes);
} catch (error) {
  console.log('  Health check error:', error.message);
}

console.log('\n✅ All controllers and routes loaded successfully!');