/**
 * Payment Validation Service
 * Handles payment mode and amount validation
 */
export const paymentValidation = {
  // Supported payment modes
  PAYMENT_MODES: [
    'CREDIT_CARD',
    'DEBIT_CARD',
    'NET_BANKING',
    'UPI',
    'PAYPAL',
    'STRIPE',
    'RAZORPAY',
    'CASH',
    'COD',
    'WALLET',
    'BANK_TRANSFER',
    'CRYPTO'
  ],

  /**
   * Validate payment mode
   * @param {string} paymentMode - Payment mode string
   * @param {Array} allowedModes - Allowed payment modes
   * @returns {Object} { isValid, error, normalized }
   */
  validatePaymentMode: (paymentMode, allowedModes = null) => {
    try {
      if (!paymentMode || paymentMode.trim() === '') {
        return {
          isValid: false,
          error: 'Payment mode is required',
          normalized: null
        };
      }

      const normalized = paymentMode.trim().toUpperCase().replace(/ /g, '_');
      const modes = allowedModes || paymentValidation.PAYMENT_MODES;

      // Check if payment mode is in allowed list
      if (modes.includes(normalized)) {
        return {
          isValid: true,
          error: null,
          normalized: normalized
        };
      }

      // Try fuzzy matching
      const matchedMode = modes.find(mode => 
        mode.includes(normalized) || normalized.includes(mode)
      );

      if (matchedMode) {
        return {
          isValid: true,
          error: null,
          normalized: matchedMode,
          matched: true
        };
      }

      return {
        isValid: false,
        error: `Invalid payment mode: ${paymentMode}. Allowed: ${modes.join(', ')}`,
        normalized: null
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message || 'Payment mode validation failed',
        normalized: null
      };
    }
  },

  /**
   * Validate amount
   * @param {number|string} amount - Amount to validate
   * @param {Object} options - Validation options
   * @returns {Object} { isValid, error, value }
   */
  validateAmount: (amount, options = {}) => {
    try {
      if (amount === undefined || amount === null || amount === '') {
        return {
          isValid: false,
          error: 'Amount is required',
          value: null
        };
      }

      const value = typeof amount === 'string' ? parseFloat(amount) : amount;

      if (isNaN(value)) {
        return {
          isValid: false,
          error: 'Invalid amount format',
          value: null
        };
      }

      if (value < 0) {
        return {
          isValid: false,
          error: 'Amount cannot be negative',
          value: value
        };
      }

      if (options.minAmount !== undefined && value < options.minAmount) {
        return {
          isValid: false,
          error: `Amount must be at least ${options.minAmount}`,
          value: value
        };
      }

      if (options.maxAmount !== undefined && value > options.maxAmount) {
        return {
          isValid: false,
          error: `Amount cannot exceed ${options.maxAmount}`,
          value: value
        };
      }

      // Check for decimal places
      if (options.maxDecimals !== undefined) {
        const decimals = (value.toString().split('.')[1] || '').length;
        if (decimals > options.maxDecimals) {
          return {
            isValid: false,
            error: `Amount cannot have more than ${options.maxDecimals} decimal places`,
            value: value
          };
        }
      }

      return {
        isValid: true,
        error: null,
        value: value,
        formatted: value.toFixed(2)
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message || 'Amount validation failed',
        value: null
      };
    }
  },

  /**
   * Validate currency
   * @param {string} currency - Currency code
   * @param {Array} allowedCurrencies - Allowed currencies
   * @returns {Object} { isValid, error, normalized }
   */
  validateCurrency: (currency, allowedCurrencies = ['INR', 'USD', 'EUR', 'SGD', 'GBP']) => {
    try {
      if (!currency || currency.trim() === '') {
        return {
          isValid: false,
          error: 'Currency is required',
          normalized: null
        };
      }

      const normalized = currency.trim().toUpperCase();
      
      if (allowedCurrencies.includes(normalized)) {
        return {
          isValid: true,
          error: null,
          normalized: normalized
        };
      }

      return {
        isValid: false,
        error: `Invalid currency: ${currency}. Allowed: ${allowedCurrencies.join(', ')}`,
        normalized: null
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message || 'Currency validation failed',
        normalized: null
      };
    }
  },

  /**
   * Validate transaction complete
   * @param {Object} transaction - Transaction object
   * @param {Object} options - Validation options
   * @returns {Object} { isValid, errors, validated }
   */
  validateTransaction: (transaction, options = {}) => {
    const errors = [];
    const validated = {};

    // Validate payment mode
    const modeResult = paymentValidation.validatePaymentMode(
      transaction.paymentMode || transaction.payment_method,
      options.allowedModes
    );
    if (!modeResult.isValid) {
      errors.push({ field: 'paymentMode', error: modeResult.error });
    } else {
      validated.paymentMode = modeResult.normalized;
    }

    // Validate amount
    const amountResult = paymentValidation.validateAmount(
      transaction.amount || transaction.price,
      options
    );
    if (!amountResult.isValid) {
      errors.push({ field: 'amount', error: amountResult.error });
    } else {
      validated.amount = amountResult.value;
    }

    // Validate currency
    if (transaction.currency) {
      const currencyResult = paymentValidation.validateCurrency(
        transaction.currency,
        options.allowedCurrencies
      );
      if (!currencyResult.isValid) {
        errors.push({ field: 'currency', error: currencyResult.error });
      } else {
        validated.currency = currencyResult.normalized;
      }
    }

    // Validate transaction ID
    if (transaction.transactionId || transaction.orderId) {
      const id = transaction.transactionId || transaction.orderId;
      if (!id || id.trim() === '') {
        errors.push({ field: 'transactionId', error: 'Transaction ID is required' });
      } else {
        validated.transactionId = id.trim();
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      validated: validated
    };
  }
};

export default paymentValidation;