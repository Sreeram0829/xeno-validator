# API_DOCS.md

# Base URL

```text
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication for testing purposes.

# ENDPOINTS

## Health Check

Check if the API is running.

### GET /api/health

**Response:**

```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2026-06-19T05:52:08.975Z",
    "uptime": 120.5,
    "memory": {
      "used": 45.2,
      "total": 128.0
    },
    "system": {
      "platform": "win32",
      "release": "10.0.19045",
      "cpus": 8
    }
  }
}
```

---

## Upload & Validate CSV

Upload a CSV file for validation.

### POST /api/upload

**Request:**

**Content-Type:** `multipart/form-data`

**Body:**

* `file`: CSV file (required)
* `country`: Country code (optional, default: `'IN'`)

**Response:**

```json
{
  "success": true,
  "message": "File uploaded and validated successfully",
  "data": {
    "fileId": "2973e835-1efb-4682-b7cb-d92f75a63445",
    "fileName": "customers.csv",
    "fileSize": 24670,
    "country": "IN",
    "status": "completed",
    "summary": {
      "total": 999,
      "valid": 300,
      "invalid": 699,
      "errorRate": "69.97"
    },
    "downloadLinks": {
      "cleanedFile": "/api/download/cleaned/2973e835-1efb-4682-b7cb-d92f75a63445",
      "errorReport": "/api/download/errors/2973e835-1efb-4682-b7cb-d92f75a63445",
      "chunks": "/api/download/chunks/2973e835-1efb-4682-b7cb-d92f75a63445",
      "summary": "/api/download/summary/2973e835-1efb-4682-b7cb-d92f75a63445",
      "report": "/api/download/report/2973e835-1efb-4682-b7cb-d92f75a63445"
    }
  }
}
```

---

## Get Upload Status

Get the status of an uploaded file.

### GET /api/upload/status/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:**

```json
{
  "success": true,
  "message": "Status retrieved successfully",
  "data": {
    "fileId": "2973e835-1efb-4682-b7cb-d92f75a63445",
    "summary": {
      "total": 999,
      "valid": 300,
      "invalid": 699,
      "errorRate": "69.97"
    },
    "timestamp": "2026-06-19T05:52:08.975Z",
    "fileInfo": {
      "originalFile": "customers.csv",
      "cleanedFile": "2973e835-1efb-4682-b7cb-d92f75a63445_cleaned.csv",
      "errorFile": "2973e835-1efb-4682-b7cb-d92f75a63445_errors.csv"
    }
  }
}
```

---

## Download Cleaned CSV

### GET /api/download/cleaned/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:** CSV file download

---

## Download Error Report

### GET /api/download/errors/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:** CSV file download with error details

---

## Download Summary Report (JSON)

### GET /api/download/summary/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:**

```json
{
  "fileId": "2973e835-1efb-4682-b7cb-d92f75a63445",
  "country": "IN",
  "timestamp": "2026-06-19T05:52:08.975Z",
  "summary": {
    "total": 999,
    "valid": 300,
    "invalid": 699,
    "errorRate": "69.97"
  },
  "fileInfo": {
    "originalFile": "customers.csv",
    "cleanedFile": "2973e835-1efb-4682-b7cb-d92f75a63445_cleaned.csv",
    "errorFile": "2973e835-1efb-4682-b7cb-d92f75a63445_errors.csv"
  }
}
```

---

## Download Text Report

### GET /api/download/report/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:** Text file download with formatted report

---

## Download Chunk

### GET /api/download/chunk/:fileId/:chunkIndex

**Parameters:**

* `fileId`: UUID of the uploaded file
* `chunkIndex`: Index of the chunk to download

**Response:** CSV file download (chunk)

---

## Get Chunk Information

### GET /api/download/chunks/info/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:**

```json
{
  "success": true,
  "message": "Chunks retrieved successfully",
  "data": {
    "fileId": "2973e835-1efb-4682-b7cb-d92f75a63445",
    "totalChunks": 3,
    "chunks": [
      {
        "index": 0,
        "name": "2973e835-1efb-4682-b7cb-d92f75a63445_chunk_0.csv",
        "size": 102400,
        "sizeFormatted": "100 KB",
        "created": "2026-06-19T05:52:08.975Z",
        "modified": "2026-06-19T05:52:08.975Z"
      }
    ],
    "downloadLinks": [
      {
        "index": 0,
        "url": "/api/download/chunk/2973e835-1efb-4682-b7cb-d92f75a63445/0"
      }
    ]
  }
}
```

---

## Download All Chunks as ZIP

### GET /api/download/chunks/:fileId

**Parameters:**

* `fileId`: UUID of the uploaded file

**Response:** ZIP file download containing all chunks

---

## Get System Status

### GET /api/status

**Response:**

```json
{
  "success": true,
  "message": "System status retrieved successfully",
  "data": {
    "server": {
      "status": "running",
      "port": 5000,
      "environment": "development",
      "uptime": 120.5
    },
    "directories": {
      "exists": {
        "uploads": true,
        "cleaned": true,
        "chunks": true,
        "reports": true
      },
      "fileCounts": {
        "uploads": 5,
        "cleaned": 3,
        "chunks": 1,
        "reports": 4
      }
    },
    "validation": {
      "defaultCountry": "IN",
      "allowedCountries": ["IN", "SG", "US", "UK", "AU", "CA"],
      "chunkSize": 1000,
      "maxFileSize": "100 MB"
    }
  }
}
```

---

## Get Server Information

### GET /api/info

**Response:**

```json
{
  "success": true,
  "message": "Server info retrieved successfully",
  "data": {
    "name": "Xeno Transaction Validator API",
    "version": "1.0.0",
    "environment": "development",
    "nodeVersion": "v22.3.0",
    "platform": "win32",
    "architecture": "x64",
    "uptime": 120.5,
    "startTime": "2026-06-19T05:50:08.975Z",
    "memory": {
      "total": "16.00 GB",
      "free": "8.00 GB",
      "processUsed": "45.20 MB"
    },
    "endpoints": {
      "health": "/api/health",
      "status": "/api/status",
      "stats": "/api/stats",
      "upload": "/api/upload",
      "download": "/api/download/:fileId",
      "validation": "/api/validation/:fileId"
    }
  }
}
```

---

## Get Statistics

### GET /api/stats

**Response:**

```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalFiles": 3,
    "totalRows": 2997,
    "totalErrors": 699,
    "averageErrorRate": "23.33",
    "processedCountries": {
      "IN": 2,
      "SG": 1
    },
    "timestamp": "2026-06-19T05:52:08.975Z"
  }
}
```

---

## Cleanup Old Files

### DELETE /api/cleanup?days=7

**Query Parameters:**

* `days`: Number of days to keep (default: 7)

**Response:**

```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "data": {
    "deletedFiles": 12,
    "freedSpace": "5.24 MB",
    "freedSpaceBytes": 5494538,
    "maxAge": "7 days"
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": null,
  "timestamp": "2026-06-19T05:52:08.975Z"
}
```

### Common HTTP Status Codes

* 200: Success
* 400: Bad Request
* 404: Not Found
* 413: File Too Large
* 500: Internal Server Error

---

## Supported Countries

| Code | Country        | Phone Format |
| ---- | -------------- | ------------ |
| IN   | India          | 10 digits    |
| SG   | Singapore      | 8 digits     |
| US   | United States  | 10 digits    |
| UK   | United Kingdom | 10 digits    |
| AU   | Australia      | 9 digits     |
| CA   | Canada         | 10 digits    |

---

## File Format Requirements

CSV files must have the following columns:

* `order_id` or `customer_id`: Unique identifier
* `amount` or `price`: Numeric value
* `phone` or `phone_number`: Phone number
* `email`: Email address (optional)
* `date` or `signup_date`: Date in DD-MM-YYYY format

---

## Version History

### v1.0.0 - Initial Release

* CSV upload and validation
* Country-specific phone validation
* File chunking
* Download support (cleaned, errors, chunks)
* Summary reports

## Architecture Description

# System Architecture
+------------------------------------------------------------------+
|                XENO TRANSACTION DATA VALIDATOR                   |
|                          ARCHITECTURE                            |
+------------------------------------------------------------------+

┌──────────────────────┐         HTTP/API         ┌──────────────────────┐
│                      │ <----------------------> │                      │
│   FRONTEND (React)   │                          │  BACKEND (Node.js)   │
│                      │                          │                      │
│ • File Upload        │                          │ • Express Server     │
│ • Country Selection  │                          │ • API Routes         │
│ • Validation Results │                          │ • File Processing    │
│ • Download Section   │                          │ • Data Validation    │
│ • Chunk Reports      │                          │ • CSV Chunking       │
│ • About Page         │                          │ • File Generation    │
│                      │                          │                      │
└──────────────────────┘                          └──────────────────────┘
│
│
▼
┌────────────────────────────┐
│     VALIDATION ENGINE      │
│                            │
│ • Phone Validation         │
│ • Date Validation          │
│ • Missing Field Checks     │
│ • Data Integrity Checks    │
│ • Country-Specific Rules   │
│                            │
└────────────────────────────┘
│
▼
┌────────────────────────────┐
│       CSV PROCESSING       │
│                            │
│ • CSV Parsing              │
│ • Data Cleaning            │
│ • Error Detection          │
│ • File Splitting           │
│ • Report Generation        │
│                            │
└────────────────────────────┘
│
▼
┌────────────────────────────┐
│        FILE STORAGE        │
│                            │
│ uploads/                  │
│ outputs/                  │
│ cleaned/                 │
│ chunks/                  │
│ reports/                 │
│                            │
└────────────────────────────┘

# Technology Stack

## Frontend

* React 18
* React Router DOM 6
* React Dropzone (File Upload)
* Axios (HTTP Requests)
* Tailwind CSS
* Vite

## Backend

* Node.js
* Express.js
* Multer (File Upload Handling)
* csv-parser (CSV Parsing)
* fast-csv (CSV Generation)
* libphonenumber-js (Phone Number Validation)
* date-fns (Date Validation and Formatting)
* UUID (Unique File Identification)
* fs-extra (File System Operations)

## Deployment

* Backend: Render
* Frontend: Vercel

---

# Data Flow

1. User uploads a CSV file through the React frontend.
2. The file is sent to the Express backend using a REST API.
3. The backend validates:

   * File type (CSV only)
   * File size (up to 100 MB)
   * Country-specific validation rules
4. The uploaded file is stored temporarily in the uploads directory.
5. CSV data is parsed row by row.
6. Each record is validated for:

   * Phone number format
   * Date format
   * Required fields
   * Email format
   * Transaction amount validity
7. Valid records are written to a cleaned CSV file.
8. Invalid records are written to an error report.
9. A validation summary report is generated.
10. Large files are automatically split into smaller CSV chunks.
11. Results are returned to the frontend.
12. Users can download:

    * Cleaned CSV
    * Error Report
    * Validation Summary
    * Text Report
    * Individual CSV Chunks
    * ZIP Archive of All Chunks

---

# Security Features

* CSV file type validation
* Maximum file size limit (100 MB)
* Input sanitization
* Centralized error handling
* Secure file storage
* Protection against malformed input files
* No database dependency, eliminating SQL injection risks

---

# Supported Validations

* Country-Specific Phone Number Validation
* Date Format Validation
* Email Format Validation
* Required Field Validation
* Transaction Amount Validation
* Data Integrity Checks
* CSV Structure Validation

