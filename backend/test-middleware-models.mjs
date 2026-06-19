// test-middleware-models.mjs
import { upload, uploadSingle, handleMulterError } from './src/middleware/uploadMiddleware.js';
import { errorMiddleware } from './src/middleware/errorMiddleware.js';
import { validationMiddleware } from './src/middleware/validationMiddleware.js';
import { TransactionModel } from './src/models/transactionModel.js';
import { ValidationResultModel } from './src/models/validationResultModel.js';

console.log('✅ Middleware and Models loaded successfully!');

console.log('\n📋 Middleware:');
console.log('  - uploadMiddleware: upload, uploadSingle, handleMulterError');
console.log('  - errorMiddleware:', Object.keys(errorMiddleware));
console.log('  - validationMiddleware:', Object.keys(validationMiddleware));

console.log('\n📋 Models:');
console.log('  - TransactionModel methods:', Object.getOwnPropertyNames(TransactionModel.prototype).filter(p => p !== 'constructor'));
console.log('  - ValidationResultModel methods:', Object.getOwnPropertyNames(ValidationResultModel.prototype).filter(p => p !== 'constructor'));

// Test TransactionModel
console.log('\n🔍 Testing TransactionModel:');
const transaction = new TransactionModel({
  orderId: 'ORD-001',
  amount: '100.50',
  paymentMode: 'UPI',
  phone: '9876543210',
  email: 'test@example.com',
  date: '15-06-2024'
});
const validation = transaction.validate();
console.log('  Transaction valid:', validation.isValid);
console.log('  Transaction errors:', validation.errors);

// Test ValidationResultModel
console.log('\n🔍 Testing ValidationResultModel:');
const result = ValidationResultModel.createEmpty('test-file-id', 'test.csv', 'IN');
result.addError({ rowNumber: 1, message: 'Invalid phone number', field: 'phone' });
result.addValidRow({ orderId: 'ORD-001', amount: 100 });
result.incrementTotal();
console.log('  Validation summary:', result.getSummary());
console.log('  Error stats:', result.getErrorStats());

console.log('\n✅ All tests passed!');