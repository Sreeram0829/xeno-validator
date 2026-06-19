/**
 * Transaction Model
 * Defines the structure and validation rules for transaction data
 */
export class TransactionModel {
  constructor(data = {}) {
    this.orderId = data.orderId || data.order_id || data.transactionId || data.transaction_id || '';
    this.product = data.product || data.product_name || data.item || '';
    this.amount = data.amount || data.price || data.total || 0;
    this.currency = data.currency || 'INR';
    this.paymentMode = data.paymentMode || data.payment_mode || data.paymentMethod || '';
    this.phone = data.phone || data.phone_number || data.mobile || '';
    this.email = data.email || data.customer_email || '';
    this.date = data.date || data.transaction_date || data.order_date || '';
    this.customerName = data.customerName || data.customer_name || data.name || '';
    this.status = data.status || 'pending';
    this.rawData = data;
  }

  /**
   * Validate transaction data
   * @param {Object} rules - Validation rules
   * @returns {Object} { isValid, errors }
   */
  validate(rules = {}) {
    const errors = [];

    // Validate orderId
    if (!this.orderId || this.orderId.trim() === '') {
      errors.push({ field: 'orderId', message: 'Order ID is required' });
    }

    // Validate amount
    if (this.amount === undefined || this.amount === null || this.amount === '') {
      errors.push({ field: 'amount', message: 'Amount is required' });
    } else if (isNaN(parseFloat(this.amount)) || parseFloat(this.amount) < 0) {
      errors.push({ field: 'amount', message: 'Amount must be a positive number' });
    }

    // Validate phone if provided
    if (this.phone && this.phone.trim() !== '') {
      const phoneStr = this.phone.trim();
      // Basic phone validation - can be enhanced with country-specific rules
      if (!/^[0-9+\-\s()]{8,15}$/.test(phoneStr)) {
        errors.push({ field: 'phone', message: 'Invalid phone number format' });
      }
    }

    // Validate email if provided
    if (this.email && this.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email.trim())) {
        errors.push({ field: 'email', message: 'Invalid email format' });
      }
    }

    // Validate date if provided
    if (this.date && this.date.trim() !== '') {
      // Basic date validation - can be enhanced
      const dateRegex = /^(\d{2}-\d{2}-\d{4}|\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$/;
      if (!dateRegex.test(this.date.trim())) {
        errors.push({ field: 'date', message: 'Invalid date format' });
      }
    }

    // Validate payment mode if provided
    if (this.paymentMode && this.paymentMode.trim() !== '') {
      const validModes = ['CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'UPI', 'PAYPAL', 'STRIPE', 'RAZORPAY', 'CASH', 'COD', 'WALLET', 'BANK_TRANSFER'];
      const normalized = this.paymentMode.trim().toUpperCase().replace(/ /g, '_');
      if (!validModes.includes(normalized)) {
        errors.push({ 
          field: 'paymentMode', 
          message: `Invalid payment mode. Allowed: ${validModes.join(', ')}` 
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Convert to JSON object
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      orderId: this.orderId,
      product: this.product,
      amount: parseFloat(this.amount) || 0,
      currency: this.currency,
      paymentMode: this.paymentMode,
      phone: this.phone,
      email: this.email,
      date: this.date,
      customerName: this.customerName,
      status: this.status
    };
  }

  /**
   * Convert to CSV row
   * @returns {Object} CSV row object
   */
  toCSVRow() {
    return {
      order_id: this.orderId,
      product: this.product,
      amount: this.amount,
      currency: this.currency,
      payment_mode: this.paymentMode,
      phone: this.phone,
      email: this.email,
      date: this.date,
      customer_name: this.customerName,
      status: this.status
    };
  }

  /**
   * Create from CSV row
   * @param {Object} row - CSV row data
   * @returns {TransactionModel} New instance
   */
  static fromCSVRow(row) {
    return new TransactionModel({
      orderId: row.order_id || row.orderId || row.OrderID,
      product: row.product || row.product_name || row.Product,
      amount: row.amount || row.price || row.Amount,
      currency: row.currency || row.Currency,
      paymentMode: row.payment_mode || row.paymentMethod || row.Payment_Mode,
      phone: row.phone || row.phone_number || row.Phone,
      email: row.email || row.Email || row.customer_email,
      date: row.date || row.transaction_date || row.Date,
      customerName: row.customer_name || row.customerName || row.Customer_Name,
      status: row.status || row.Status
    });
  }

  /**
   * Create from JSON
   * @param {Object} json - JSON data
   * @returns {TransactionModel} New instance
   */
  static fromJSON(json) {
    return new TransactionModel(json);
  }

  /**
   * Get validation schema
   * @returns {Object} Validation schema
   */
  static getValidationSchema() {
    return {
      orderId: {
        type: 'string',
        required: true,
        maxLength: 100
      },
      amount: {
        type: 'number',
        required: true,
        min: 0
      },
      currency: {
        type: 'string',
        required: false,
        maxLength: 3
      },
      paymentMode: {
        type: 'string',
        required: false,
        maxLength: 50
      },
      phone: {
        type: 'string',
        required: false,
        maxLength: 20
      },
      email: {
        type: 'string',
        required: false,
        maxLength: 100,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      date: {
        type: 'string',
        required: false,
        maxLength: 20
      },
      customerName: {
        type: 'string',
        required: false,
        maxLength: 200
      }
    };
  }
}

export default TransactionModel;