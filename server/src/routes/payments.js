import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPaymentIntent } from '../services/stripeService.js';
import {
  initiateM2MPayment,
  initiateAirtelPayment,
  checkPaymentStatus,
  confirmPayment,
  processBankTransfer,
} from '../services/mobileMoneyService.js';
import { makeId, payments, doctorPaymentAccounts } from '../data/mockStore.js';

const router = Router();

// ASIFIWE Ruth is the primary doctor - all consultation payments go here
const ASIFIWE_ID = 'usr-nutritionist';
const ASIFIWE_PAYMENT_ACCOUNT = doctorPaymentAccounts[ASIFIWE_ID];

// Schema for initiating mobile money payment
const mobileMoneyPaymentSchema = z.object({
  body: z.object({
    appointmentId: z.string().optional(),
    courseId: z.string().optional(),
    amountCents: z.number().int().positive(),
    paymentMethod: z.enum(['mtn', 'airtel']),
    phoneNumber: z.string().regex(/^\+?250\d{9}$/, 'Invalid phone number format'),
  }),
});

// Schema for confirming payment
const confirmPaymentSchema = z.object({
  body: z.object({
    requestId: z.string(),
    confirmationCode: z.string(),
  }),
});

// Schema for bank transfer
const bankTransferSchema = z.object({
  body: z.object({
    appointmentId: z.string().optional(),
    courseId: z.string().optional(),
    amountCents: z.number().int().positive(),
    accountHolder: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    referenceNumber: z.string(),
  }),
});

// Get all payments for user
router.get('/', authenticate, (req, res) => {
  return res.json({
    payments: payments.filter((payment) => payment.userId === req.user.id || req.user.role === 'admin'),
  });
});

// Initiate Stripe payment (for web/card payments)
router.post('/intent', authenticate, validate(z.object({
  body: z.object({
    appointmentId: z.string().optional(),
    courseId: z.string().optional(),
    amountCents: z.number().int().positive(),
  }),
})), async (req, res, next) => {
  try {
    const intent = await createPaymentIntent({
      amountCents: req.validated.body.amountCents,
      metadata: {
        userId: req.user.id,
        appointmentId: req.validated.body.appointmentId || '',
        courseId: req.validated.body.courseId || '',
      },
    });
    return res.status(201).json({ paymentIntent: intent });
  } catch (error) {
    return next(error);
  }
});

/**
 * Initiate mobile money payment (MTN or Airtel)
 * Money will be sent to ASIFIWE Ruth's account
 * User receives a payment prompt on their phone
 */
router.post('/mobile-money/initiate', validate(mobileMoneyPaymentSchema), async (req, res, next) => {
  try {
    const userId = req.user?.id || 'test-user'; // Use test user if not authenticated
    const { paymentMethod, phoneNumber, amountCents, appointmentId, courseId } = req.validated.body;
    const externalId = `PAY-${Date.now()}`;

    let paymentResponse;

    if (paymentMethod === 'mtn') {
      paymentResponse = await initiateM2MPayment({
        phoneNumber,
        amountCents,
        externalId,
      });
    } else if (paymentMethod === 'airtel') {
      paymentResponse = await initiateAirtelPayment({
        phoneNumber,
        amountCents,
        externalId,
      });
    } else {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Create payment record with "processing" status
    // Money will go to ASIFIWE Ruth's account
    const payment = {
      id: makeId('pay'),
      userId,
      appointmentId,
      courseId,
      paymentMethod,
      phoneNumber, // Customer's phone who is paying
      amountCents,
      status: 'processing',
      requestId: paymentResponse.requestId,
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      nutritionistId: ASIFIWE_ID, // Money goes to ASIFIWE Ruth
      recipientPhone: ASIFIWE_PAYMENT_ACCOUNT.phoneNumberFormatted, // ASIFIWE's MTN number
      recipientName: ASIFIWE_PAYMENT_ACCOUNT.name,
      createdAt: new Date(),
    };

    payments.push(payment);

    return res.status(201).json({
      payment,
      paymentRequest: paymentResponse,
      message: `Payment prompt sent to ${phoneNumber}. Funds will be transferred to ${ASIFIWE_PAYMENT_ACCOUNT.name} (${ASIFIWE_PAYMENT_ACCOUNT.phoneNumberFormatted}).`,
      recipient: {
        name: ASIFIWE_PAYMENT_ACCOUNT.name,
        phone: ASIFIWE_PAYMENT_ACCOUNT.phoneNumberFormatted,
      },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Check payment status (polling endpoint)
 * Client polls this to check if user confirmed payment on their phone
 */
router.post('/mobile-money/check-status', (req, res, next) => {
  try {
    const userId = req.user?.id || 'test-user'; // Use test user if not authenticated
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID required' });
    }

    // Find payment record
    const payment = payments.find((p) => p.requestId === requestId && p.userId === userId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    // In production, check with payment provider
    // For mock: simulate random confirmation
    if (Math.random() > 0.8) {
      payment.status = 'confirmed';
      payment.processedAt = new Date();
    }

    return res.json({
      status: payment.status,
      payment,
      message: payment.status === 'confirmed'
        ? 'Payment confirmed successfully'
        : 'Waiting for payment confirmation. Please check your phone.',
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Confirm payment after user confirms on phone
 * User enters confirmation code shown on their phone
 * Money is then transferred to ASIFIWE Ruth's account
 */
router.post('/mobile-money/confirm', validate(confirmPaymentSchema), async (req, res, next) => {
  try {
    const userId = req.user?.id || 'test-user'; // Use test user if not authenticated
    const { requestId, confirmationCode } = req.validated.body;

    // Find payment record
    const payment = payments.find((p) => p.requestId === requestId && p.userId === userId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    // Confirm the payment
    const result = await confirmPayment(requestId, confirmationCode);

    // Update payment status
    payment.status = 'confirmed';
    payment.confirmationCode = confirmationCode;
    payment.processedAt = new Date();

    // Mark appointment as paid if applicable
    if (payment.appointmentId) {
      // Update appointment payment status in database
      // appointments.find(a => a.id === payment.appointmentId).payment_status = 'confirmed';
    }

    return res.json({
      payment,
      message: `Payment confirmed! ${payment.amountCents / 100} RWF has been transferred to ${ASIFIWE_PAYMENT_ACCOUNT.name} (${ASIFIWE_PAYMENT_ACCOUNT.phoneNumberFormatted}). Your consultation is now scheduled.`,
      recipient: {
        name: ASIFIWE_PAYMENT_ACCOUNT.name,
        phone: ASIFIWE_PAYMENT_ACCOUNT.phoneNumberFormatted,
      },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Process bank transfer payment
 * Record bank transfer details for manual verification
 */
router.post('/bank-transfer', validate(bankTransferSchema), async (req, res, next) => {
  try {
    const userId = req.user?.id || 'test-user'; // Use test user if not authenticated
    const {
      amountCents,
      appointmentId,
      courseId,
      accountHolder,
      accountNumber,
      bankName,
      referenceNumber,
    } = req.validated.body;

    const bankTransfer = await processBankTransfer({
      accountHolder,
      accountNumber,
      bankName,
      referenceNumber,
      amountCents,
      externalId: `BANK-${Date.now()}`,
    });

    // Create payment record with "pending_verification" status
    const payment = {
      id: makeId('pay'),
      userId,
      appointmentId,
      courseId,
      paymentMethod: 'bank',
      bankReference: referenceNumber,
      amountCents,
      status: 'processing',
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(),
    };

    payments.push(payment);

    return res.status(201).json({
      payment,
      bankTransfer,
      message: 'Bank transfer recorded. Please keep your reference number. Admin will verify within 24 hours.',
    });
  } catch (error) {
    return next(error);
  }
});

// Confirm Stripe payment
router.post('/confirm', authenticate, (req, res) => {
  const payment = {
    id: makeId('pay'),
    userId: req.user.id,
    appointmentId: req.body.appointmentId,
    amountCents: req.body.amountCents,
    paymentMethod: 'stripe',
    status: 'confirmed',
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  payments.push(payment);
  return res.status(201).json({ payment });
});

// Get invoice for payment
router.get('/:id/invoice', authenticate, (req, res) => {
  const payment = payments.find((item) => item.id === req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found.' });
  }
  return res.json({
    invoice: {
      number: payment.invoiceNumber,
      amountCents: payment.amountCents,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      lineItems: payment.appointmentId
        ? ['Nutrition healthcare consultation']
        : ['Educational course access'],
    },
  });
});

export default router;

