/**
 * Application Constants
 * Global constants used across the application
 */

export const CONSTANTS = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Error Messages
  ERROR_MESSAGES: {
    FILE_NOT_FOUND: 'File not found',
    INVALID_FILE_TYPE: 'Invalid file type. Only CSV files are allowed',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit',
    VALIDATION_FAILED: 'Data validation failed',
    COUNTRY_NOT_SUPPORTED: 'Country code is not supported',
    PROCESSING_FAILED: 'File processing failed',
    REPORT_NOT_FOUND: 'Validation report not found',
    INVALID_PHONE: 'Invalid phone number for the selected country',
    INVALID_DATE: 'Invalid date format',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_AMOUNT: 'Invalid amount value',
    MISSING_REQUIRED_FIELD: 'Missing required field'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    FILE_UPLOADED: 'File uploaded successfully',
    FILE_VALIDATED: 'File validated successfully',
    FILE_DOWNLOADED: 'File downloaded successfully',
    REPORT_GENERATED: 'Validation report generated successfully',
    CLEANUP_COMPLETED: 'Cleanup completed successfully',
    CHUNKS_CREATED: 'File chunks created successfully'
  },

  // File Constants
  FILE: {
    MAX_CHUNK_SIZE: 1000,
    DATE_FORMATS: ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY'],
    ALLOWED_EXTENSIONS: ['.csv'],
    ALLOWED_MIME_TYPES: ['text/csv', 'application/csv', 'application/vnd.ms-excel'],
    MAX_FILE_SIZE: 100 * 1024 * 1024 // 100MB
  },

  // Validation Constants
  VALIDATION: {
    MAX_ERRORS_TO_REPORT: 10000,
    DEFAULT_COUNTRY: 'IN'
  },

  // Queue Constants (for future use)
  QUEUE: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000,
    CONCURRENCY: 5
  },

  // Date Constants
  DATE: {
    DEFAULT_FORMAT: 'DD-MM-YYYY',
    DISPLAY_FORMAT: 'DD MMM YYYY',
    API_FORMAT: 'YYYY-MM-DD'
  }
};

export default CONSTANTS;