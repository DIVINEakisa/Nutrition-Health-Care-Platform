/**
 * Mobile Money Payment Service
 * Handles MTN Mobile Money and Airtel Money payment processing
 */

import { env } from '../config/env.js';

// Mock payment gateway responses
// In production, integrate with actual MTN and Airtel APIs
const MOCK_MODE = !env.mtnApiKey || !env.airtelApiKey;

// Simulated payment transactions storage
const paymentTransactions = new Map();

/**
 * Initiate MTN Mobile Money payment
 * @param {Object} params - Payment parameters
 * @param {string} params.phoneNumber - Customer's MTN phone number
 * @param {number} params.amountCents - Amount in cents (e.g., 50000 = 500 RWF)
 * @param {string} params.externalId - External transaction reference
 * @param {string} params.payerMessage - Message for payer
 * @param {string} params.payeeNote - Note for payee
 * @returns {Promise<Object>} Payment request response with transaction ID
 */
export async function initiateM2MPayment({
  phoneNumber,
  amountCents,
  externalId,
  payerMessage = 'Nutrition consultation payment',
  payeeNote = 'ASIFIWE Healthcare Platform',
}) {
  try {
    // Normalize phone number (remove + and leading 0)
    const normalizedPhone = phoneNumber.replace(/^\+?250/, '').replace(/^0/, '');
    const mtnPhone = `250${normalizedPhone}`;

    if (MOCK_MODE) {
      // Mock mode - simulate MTN API response
      const requestId = `MTN-${Date.now()}`;
      const mockTransaction = {
        requestId,
        status: 'pending',
        phoneNumber: mtnPhone,
        amountCents,
        currency: 'RWF',
        externalId,
        createdAt: new Date(),
        confirmationCode: `MTN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      };
      paymentTransactions.set(requestId, mockTransaction);

      return {
        status: 'pending',
        requestId,
        message: 'Payment prompt sent to phone. Please approve on your phone.',
        phoneNumber: mtnPhone,
        amount: (amountCents / 100).toFixed(0),
        externalId,
      };
    }

    // Production: Call actual MTN Collections API
    // Implementation would use mtn-momo-api or similar
    const response = await callMtnCollectionsApi({
      phoneNumber: mtnPhone,
      amount: amountCents / 100, // Convert to RWF
      externalId,
      payerMessage,
      payeeNote,
    });

    return {
      status: response.status,
      requestId: response.requestId,
      message: 'Payment prompt sent to phone',
      phoneNumber: mtnPhone,
      amount: response.amount,
    };
  } catch (error) {
    console.error('MTN payment initiation error:', error);
    throw new Error(`MTN payment failed: ${error.message}`);
  }
}

/**
 * Initiate Airtel Money payment
 * @param {Object} params - Payment parameters
 * @param {string} params.phoneNumber - Customer's Airtel phone number
 * @param {number} params.amountCents - Amount in cents
 * @param {string} params.externalId - External transaction reference
 * @returns {Promise<Object>} Payment request response
 */
export async function initiateAirtelPayment({
  phoneNumber,
  amountCents,
  externalId,
  payerMessage = 'Nutrition consultation payment',
}) {
  try {
    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/^\+?250/, '').replace(/^0/, '');
    const airtelPhone = `250${normalizedPhone}`;

    if (MOCK_MODE) {
      // Mock mode - simulate Airtel API response
      const requestId = `ATM-${Date.now()}`;
      const mockTransaction = {
        requestId,
        status: 'pending',
        phoneNumber: airtelPhone,
        amountCents,
        currency: 'RWF',
        externalId,
        createdAt: new Date(),
        confirmationCode: `ATM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      };
      paymentTransactions.set(requestId, mockTransaction);

      return {
        status: 'pending',
        requestId,
        message: 'Payment prompt sent to phone. Please approve on your phone.',
        phoneNumber: airtelPhone,
        amount: (amountCents / 100).toFixed(0),
        externalId,
      };
    }

    // Production: Call actual Airtel API
    const response = await callAirtelPaymentApi({
      phoneNumber: airtelPhone,
      amount: amountCents / 100,
      externalId,
      payerMessage,
    });

    return {
      status: response.status,
      requestId: response.requestId,
      message: 'Payment prompt sent to phone',
      phoneNumber: airtelPhone,
      amount: response.amount,
    };
  } catch (error) {
    console.error('Airtel payment initiation error:', error);
    throw new Error(`Airtel payment failed: ${error.message}`);
  }
}

/**
 * Check payment status (poll for confirmation from customer's phone)
 * @param {string} requestId - Payment request ID from initiation
 * @returns {Promise<Object>} Current payment status
 */
export async function checkPaymentStatus(requestId) {
  // In mock mode, randomly simulate payment confirmation
  if (MOCK_MODE) {
    const transaction = paymentTransactions.get(requestId);
    if (!transaction) {
      return { status: 'failed', message: 'Transaction not found' };
    }

    // Simulate payment confirmation after a few checks (random)
    if (Math.random() > 0.7 && transaction.status === 'pending') {
      transaction.status = 'confirmed';
      transaction.confirmedAt = new Date();
      paymentTransactions.set(requestId, transaction);
    }

    return {
      status: transaction.status,
      message: transaction.status === 'confirmed' 
        ? 'Payment confirmed successfully' 
        : 'Waiting for payment confirmation on your phone',
      requestId,
      amount: transaction.amountCents / 100,
      confirmationCode: transaction.confirmationCode,
    };
  }

  // Production: Check with payment provider API
  // This would query the actual API for payment status
  return {
    status: 'pending',
    message: 'Checking payment status...',
    requestId,
  };
}

/**
 * Confirm payment and mark as completed
 * Used after user confirms payment on their phone
 * @param {string} requestId - Payment request ID
 * @param {string} confirmationCode - Confirmation code from user's phone
 * @returns {Promise<Object>} Confirmation response
 */
export async function confirmPayment(requestId, confirmationCode) {
  const transaction = paymentTransactions.get(requestId);
  
  if (!transaction) {
    throw new Error('Payment request not found');
  }

  if (transaction.status === 'confirmed') {
    return {
      status: 'confirmed',
      message: 'Payment already confirmed',
      requestId,
    };
  }

  // Verify confirmation code matches
  if (MOCK_MODE && confirmationCode !== transaction.confirmationCode) {
    throw new Error('Invalid confirmation code');
  }

  transaction.status = 'confirmed';
  transaction.confirmedAt = new Date();
  paymentTransactions.set(requestId, transaction);

  return {
    status: 'confirmed',
    message: 'Payment confirmed successfully',
    requestId,
    amount: transaction.amountCents / 100,
  };
}

/**
 * Process bank transfer payment
 * Store bank transfer reference for manual verification
 * @param {Object} params - Bank transfer details
 * @returns {Promise<Object>} Bank transfer record
 */
export async function processBankTransfer({
  accountHolder,
  accountNumber,
  bankName,
  referenceNumber,
  amountCents,
  externalId,
}) {
  const bankTransferId = `BANK-${Date.now()}`;
  
  const bankTransfer = {
    id: bankTransferId,
    accountHolder,
    accountNumber: accountNumber.replace(/\d(?=\d{4})/g, '*'), // Mask account number
    bankName,
    referenceNumber,
    amountCents,
    externalId,
    status: 'pending_verification',
    createdAt: new Date(),
  };

  // Store for manual verification
  paymentTransactions.set(bankTransferId, bankTransfer);

  return {
    status: 'pending_verification',
    id: bankTransferId,
    message: 'Bank transfer recorded. Please keep your reference number for our records.',
    referenceNumber,
    amount: amountCents / 100,
    verificationNote: 'Admin will verify this transfer within 24 hours',
  };
}

/**
 * Get stored transaction (for debugging/testing)
 */
export function getTransaction(requestId) {
  return paymentTransactions.get(requestId);
}

/**
 * Placeholder for actual MTN Collections API call
 */
async function callMtnCollectionsApi(params) {
  // TODO: Implement actual MTN Collections API integration
  // Example structure:
  // const response = await fetch('https://api.mtnrwanda.rw/momo/collections', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${env.mtnApiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     amount: params.amount,
  //     currency: 'RWF',
  //     externalId: params.externalId,
  //     payer: { partyIdType: 'MSISDN', partyId: params.phoneNumber },
  //     payerMessage: params.payerMessage,
  //     payeeNote: params.payeeNote,
  //   }),
  // });
  throw new Error('MTN API not configured');
}

/**
 * Placeholder for actual Airtel Payment API call
 */
async function callAirtelPaymentApi(params) {
  // TODO: Implement actual Airtel Payment API integration
  throw new Error('Airtel API not configured');
}
