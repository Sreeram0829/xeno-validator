import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import csv from 'csv-parser';
import appConfig from '../../config/appConfig.js';
import { getCountryRules } from '../../config/countryRules.js';

/**
 * Transaction Validation Service
 * Simplified version that works with customer data
 */
export const validateTransactionFile = async (filePath, countryCode, fileId = null) => {
  const id = fileId || uuidv4();
  const rules = getCountryRules(countryCode);
  
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: [],
    validRows: [],
    columns: []
  };

  const cleanedFilePath = path.join(appConfig.files.cleanedDir, `${id}_cleaned.csv`);
  const errorFilePath = path.join(appConfig.files.reportsDir, `${id}_errors.csv`);
  const summaryFilePath = path.join(appConfig.files.reportsDir, `${id}_summary.json`);

  try {
    await fs.ensureDir(appConfig.files.cleanedDir);
    await fs.ensureDir(appConfig.files.reportsDir);

    const validationResults = await processCSVFile(filePath, countryCode);
    
    // Write cleaned data
    if (validationResults.validRows.length > 0) {
      await writeCSV(cleanedFilePath, validationResults.validRows);
    }
    
    // Write error report
    if (validationResults.errors.length > 0) {
      await writeCSV(errorFilePath, validationResults.errors);
    }

    const summary = {
      fileId: id,
      country: countryCode,
      timestamp: new Date().toISOString(),
      summary: {
        total: validationResults.total,
        valid: validationResults.valid,
        invalid: validationResults.invalid,
        errorRate: validationResults.total > 0 
          ? (validationResults.invalid / validationResults.total * 100).toFixed(2) 
          : 0
      },
      fileInfo: {
        originalFile: path.basename(filePath),
        cleanedFile: path.basename(cleanedFilePath),
        errorFile: path.basename(errorFilePath)
      }
    };

    await fs.writeJson(summaryFilePath, summary, { spaces: 2 });

    return {
      fileId: id,
      summary: summary.summary,
      cleanedFilePath,
      errorFilePath,
      summaryFilePath
    };

  } catch (error) {
    console.error('Validation error:', error);
    throw new Error(`Validation failed: ${error.message}`);
  }
};

/**
 * Simple CSV write function
 */
const writeCSV = async (filePath, data) => {
  if (!data || data.length === 0) {
    await fs.writeFile(filePath, '');
    return;
  }

  const headers = Object.keys(data[0]);
  let csvContent = headers.join(',') + '\n';
  
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header] || '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  }

  await fs.writeFile(filePath, csvContent);
};

/**
 * Process CSV file and validate each row
 */
const processCSVFile = (filePath, countryCode) => {
  return new Promise((resolve, reject) => {
    const results = {
      total: 0,
      valid: 0,
      invalid: 0,
      validRows: [],
      errors: []
    };

    let headers = [];
    let rowNumber = 0;

    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    const readStream = fs.createReadStream(filePath);
    const parser = csv({
      columns: true,
      trim: true,
      skip_empty_lines: true
    });

    readStream
      .pipe(parser)
      .on('headers', (headerList) => {
        headers = headerList;
        console.log('📋 CSV Headers:', headers);
      })
      .on('data', (row) => {
        rowNumber++;
        results.total++;
        
        // Validate the row
        const validation = validateRow(row, countryCode);
        
        if (validation.isValid) {
          results.valid++;
          results.validRows.push(row);
        } else {
          results.invalid++;
          results.errors.push({
            rowNumber: rowNumber,
            errors: validation.errors.join('; '),
            data: row
          });
        }
      })
      .on('end', () => {
        console.log('✅ CSV processing complete:', {
          total: results.total,
          valid: results.valid,
          invalid: results.invalid
        });
        resolve(results);
      })
      .on('error', (error) => {
        console.error('❌ CSV parsing error:', error);
        reject(error);
      });
  });
};

/**
 * Validate a single row with simple checks
 */
const validateRow = (row, countryCode) => {
  const errors = [];
  let isValid = true;

  // Check if row has any data
  if (!row || Object.keys(row).length === 0) {
    errors.push('Empty row');
    return { isValid: false, errors };
  }

  // Get values from the row (case insensitive)
  const keys = Object.keys(row);
  
  // Find customer_id or similar
  const idKey = keys.find(k => k.toLowerCase().includes('customer_id') || k.toLowerCase().includes('id'));
  const nameKey = keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('full_name'));
  const emailKey = keys.find(k => k.toLowerCase().includes('email'));
  const phoneKey = keys.find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('mobile'));
  const cityKey = keys.find(k => k.toLowerCase().includes('city'));
  const dateKey = keys.find(k => k.toLowerCase().includes('date') || k.toLowerCase().includes('signup'));

  // Get values
  const id = idKey ? row[idKey] : '';
  const name = nameKey ? row[nameKey] : '';
  const email = emailKey ? row[emailKey] : '';
  const phone = phoneKey ? row[phoneKey] : '';
  const city = cityKey ? row[cityKey] : '';
  const date = dateKey ? row[dateKey] : '';

  console.log(`📊 Validating row:`, { id, name, email, phone, city, date });

  // Simple validation - just check if required fields exist
  if (!id || id.toString().trim() === '') {
    errors.push('Customer ID is required');
    isValid = false;
  }

  if (!name || name.toString().trim() === '') {
    errors.push('Name is required');
    isValid = false;
  }

  // Simple email validation
  if (email && email.toString().trim() !== '') {
    const emailStr = email.toString().trim();
    if (!emailStr.includes('@') || !emailStr.includes('.')) {
      errors.push(`Invalid email: ${emailStr}`);
      isValid = false;
    }
  }

  // Simple phone validation - just check if it's a number
  if (phone && phone.toString().trim() !== '') {
    const phoneStr = phone.toString().trim();
    const phoneDigits = phoneStr.replace(/[\s\-()]/g, '');
    if (!/^\d+$/.test(phoneDigits)) {
      errors.push(`Invalid phone number: ${phoneStr}`);
      isValid = false;
    }
    
    // Check length based on country
    if (countryCode === 'IN' && phoneDigits.length !== 10) {
      errors.push(`Phone number must be 10 digits for India: ${phoneStr}`);
      isValid = false;
    }
    if (countryCode === 'SG' && phoneDigits.length !== 8) {
      errors.push(`Phone number must be 8 digits for Singapore: ${phoneStr}`);
      isValid = false;
    }
  }

  // Simple date validation
  if (date && date.toString().trim() !== '') {
    const dateStr = date.toString().trim();
    // Check if it matches DD-MM-YYYY or DD/MM/YYYY
    const datePattern = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
    if (!datePattern.test(dateStr)) {
      errors.push(`Invalid date format: ${dateStr}. Expected DD-MM-YYYY`);
      isValid = false;
    }
  }

  // If there are no errors, mark as valid
  if (errors.length === 0) {
    isValid = true;
  }

  return { isValid, errors };
};

export default {
  validateTransactionFile,
  processCSVFile,
  validateRow
};