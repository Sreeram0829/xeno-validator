# Xeno Transaction Data Validator

A web-based platform for transaction data validation and processing.

## Overview

The Xeno Transaction Data Validator is a full-stack application that validates, cleans, and processes transaction datasets. It supports multiple countries with configurable validation rules, automatic file chunking, and comprehensive reporting.

## Features

* CSV Upload & Validation - Upload CSV files with transaction data
* Multi-Country Support - Validate phone numbers for India, Singapore, USA, UK, Australia, and Canada
* Data Validation - Validate phone numbers, dates, emails, amounts, and payment modes
* File Chunking - Automatically split large CSV files into manageable chunks
* Reports - Generate detailed validation reports and error summaries
* Downloads - Download cleaned data, error reports, chunked files, and summaries
* Real-time Progress - Track upload and processing progress

## Technology Stack

### Frontend

* React 18
* React Router DOM 6
* React Dropzone
* Axios
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* Multer
* csv-parser
* fast-csv
* libphonenumber-js
* date-fns
* UUID

## Installation

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn

### Clone Repository

```bash
git clone <repository-url>
cd xeno-transaction-validator
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=100000000
UPLOAD_DIR=./src/uploads
OUTPUT_DIR=./src/outputs
CLEANED_DIR=./src/outputs/cleaned
CHUNKS_DIR=./src/outputs/chunks
REPORTS_DIR=./src/outputs/reports
COUNTRY_DEFAULT=IN
ALLOWED_COUNTRIES=IN,SG,US,UK,AU,CA
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Access Application

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000/api

## Project Structure

```text
xeno-transaction-validator/
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Data models
│   │   ├── utils/               # Utility functions
│   │   ├── uploads/             # Uploaded files
│   │   └── outputs/             # Processed files
│   ├── server.js                # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom hooks
│   │   ├── context/             # React context
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   └── styles/              # CSS files
│   ├── index.html
│   └── package.json
├── sample-files/                # Sample CSV files
├── docs/                        # Documentation
└── README.md
```

## API Documentation

Full API documentation is available in `API_DOCS.md`.

### Key Endpoints

* POST /api/upload - Upload CSV file
* GET /api/upload/status/:fileId - Get upload status
* GET /api/download/cleaned/:fileId - Download cleaned CSV
* GET /api/download/errors/:fileId - Download error report
* GET /api/download/summary/:fileId - Download summary
* GET /api/health - Health check
* GET /api/status - System status
* DELETE /api/cleanup - Clean up old files

## Sample CSV Format

```csv
order_id,product,amount,payment_mode,phone,email,date,customer_name
ORD-001,Laptop,50000,UPI,9876543210,rahul.sharma@email.com,15-06-2024,Rahul Sharma
ORD-002,Smartphone,35000,NET_BANKING,8765432109,priya.patel@email.com,16-06-2024,Priya Patel
```

## Testing

### Sample Files

Sample CSV files are provided in the `sample-files/` directory:

* sample_transactions_valid.csv - All valid data
* sample_transactions_invalid.csv - All invalid data
* sample_transactions_mixed.csv - Mixed valid and invalid data

### Test Upload

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@sample-files/sample_transactions_valid.csv" \
  -F "country=IN"
```

## Deployment

### Backend (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set Build Command: `cd backend && npm install`
4. Set Start Command: `cd backend && node server.js`
5. Add environment variables

### Frontend (Netlify/Vercel)

1. Build the project:

```bash
cd frontend && npm run build
```

2. Deploy the `dist` folder to Netlify or Vercel
3. Set environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

* Xeno Internship Program
* All open source libraries used

## Contact

For questions or support, please contact:

* Email: ramsr0099@gmail.com
* Website: https://xeno-validator-tau.vercel.app/
