import app from './src/app.js';
import appConfig from './src/config/appConfig.js';

const PORT = appConfig.server.port || 5000;
const NODE_ENV = appConfig.server.env || 'development';

/**
 * Start the server
 */
const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Xeno Transaction Validator API');
  console.log('='.repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log('\n📋 Available Endpoints:');
  console.log(`  POST   /api/upload          - Upload and validate CSV file`);
  console.log(`  POST   /api/upload/validate - Validate file format`);
  console.log(`  GET    /api/upload/status/:fileId - Get upload status`);
  console.log(`  DELETE /api/upload/:fileId  - Delete uploaded file`);
  console.log(`  GET    /api/validation/status/:fileId - Get validation status`);
  console.log(`  GET    /api/validation/summary/:fileId - Get validation summary`);
  console.log(`  GET    /api/validation/errors/:fileId - Get validation errors`);
  console.log(`  POST   /api/validation/revalidate/:fileId - Re-validate file`);
  console.log(`  GET    /api/validation/reports - Get all reports`);
  console.log(`  GET    /api/download/cleaned/:fileId - Download cleaned file`);
  console.log(`  GET    /api/download/errors/:fileId - Download error report`);
  console.log(`  GET    /api/download/chunk/:fileId/:chunkIndex - Download chunk`);
  console.log(`  GET    /api/download/chunks/:fileId - Download all chunks as zip`);
  console.log(`  GET    /api/health          - Health check`);
  console.log(`  GET    /api/status          - System status`);
  console.log(`  GET    /api/stats           - Processing statistics`);
  console.log(`  GET    /api/info            - Server information`);
  console.log(`  DELETE /api/cleanup         - Clean up old files`);
  console.log('='.repeat(60));
  console.log('\n💡 Press CTRL+C to stop the server');
});

/**
 * Handle server errors
 */
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

/**
 * Graceful shutdown
 */
const gracefulShutdown = () => {
  console.log('\n🔴 Received shutdown signal, closing server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds if not closed
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Export server for testing
export default server;