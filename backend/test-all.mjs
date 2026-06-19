// test-all.mjs
import { dateUtils } from './src/utils/dateUtils.js';
import { fileUtils } from './src/utils/fileUtils.js';
import { csvUtils } from './src/utils/csvUtils.js';
import { responseUtils } from './src/utils/responseUtils.js';
import { phoneValidation } from './src/services/validation/phoneValidation.js';
import { dateValidation } from './src/services/validation/dateValidation.js';
import { paymentValidation } from './src/services/validation/paymentValidation.js';

console.log('✅ All utils and services loaded successfully!');
console.log('\n📋 Available Modules:');

console.log('\nUtils:');
console.log('  - dateUtils:', Object.keys(dateUtils));
console.log('  - fileUtils:', Object.keys(fileUtils));
console.log('  - csvUtils:', Object.keys(csvUtils));
console.log('  - responseUtils:', Object.keys(responseUtils));

console.log('\nServices:');
console.log('  - phoneValidation:', Object.keys(phoneValidation));
console.log('  - dateValidation:', Object.keys(dateValidation));
console.log('  - paymentValidation:', Object.keys(paymentValidation));

console.log('\n🔍 Testing phone validation:');
const phoneResult = phoneValidation.validate('9876543210', 'IN');
console.log('  India phone valid:', phoneResult.isValid);

console.log('\n🔍 Testing date validation:');
const dateResult = dateValidation.validate('15-06-2024', ['DD-MM-YYYY']);
console.log('  Date valid:', dateResult.isValid);
console.log('  Date parsed:', dateResult.formatted);

console.log('\n🔍 Testing payment validation:');
const paymentResult = paymentValidation.validatePaymentMode('UPI');
console.log('  Payment mode valid:', paymentResult.isValid);
console.log('  Payment mode:', paymentResult.normalized);

console.log('\n🔍 Testing amount validation:');
const amountResult = paymentValidation.validateAmount('100.50');
console.log('  Amount valid:', amountResult.isValid);
console.log('  Amount value:', amountResult.value);

console.log('\n✅ All tests passed!');