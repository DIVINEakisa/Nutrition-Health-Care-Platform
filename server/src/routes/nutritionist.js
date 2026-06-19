import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { makeId } from '../data/mockStore.js';

const router = Router();

// Mock storage for doctor payment accounts
const doctorPaymentAccounts = new Map();

// Schema for setting up payment account
const paymentAccountSchema = z.object({
  body: z.object({
    accountType: z.enum(['mtn', 'airtel', 'bank']),
    phoneNumber: z.string().optional(),
    accountNumber: z.string().optional(),
    accountHolder: z.string().optional(),
    bankName: z.string().optional(),
  }),
});

/**
 * GET /nutritionist/payment-account
 * Get current nutritionist's payment account information
 */
router.get('/payment-account', authenticate, (req, res) => {
  if (req.user.role !== 'nutritionist') {
    return res.status(403).json({ error: 'Only nutritionists can manage payment accounts' });
  }

  const account = doctorPaymentAccounts.get(req.user.id);

  if (!account) {
    return res.json({
      account: null,
      message: 'No payment account configured. Set up an account to receive payments.',
    });
  }

  // Mask sensitive data
  const maskedAccount = {
    ...account,
    phoneNumber: account.phoneNumber ? account.phoneNumber.slice(0, -4) + '****' : null,
    accountNumber: account.accountNumber ? account.accountNumber.slice(0, -4) + '****' : null,
  };

  return res.json({ account: maskedAccount });
});

/**
 * POST /nutritionist/payment-account
 * Set or update payment account
 */
router.post('/payment-account', authenticate, validate(paymentAccountSchema), (req, res) => {
  if (req.user.role !== 'nutritionist') {
    return res.status(403).json({ error: 'Only nutritionists can manage payment accounts' });
  }

  const { accountType, phoneNumber, accountNumber, accountHolder, bankName } = req.validated.body;

  // Validate based on account type
  if (accountType === 'mtn' || accountType === 'airtel') {
    if (!phoneNumber) {
      return res.status(400).json({
        error: `Phone number required for ${accountType.toUpperCase()} account`,
      });
    }

    // Normalize phone
    const normalizedPhone = phoneNumber.replace(/^\+?250/, '').replace(/^0/, '');
    const fullPhone = `250${normalizedPhone}`;

    if (!/^250\d{9}$/.test(fullPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const account = {
      id: makeId('acc'),
      nutritionistId: req.user.id,
      accountType,
      phoneNumber: fullPhone,
      verified: false,
      createdAt: new Date(),
    };

    doctorPaymentAccounts.set(req.user.id, account);

    return res.status(201).json({
      account,
      message: `${accountType.toUpperCase()} account set successfully. You will receive payment confirmations at ${fullPhone}.`,
    });
  } else if (accountType === 'bank') {
    if (!accountHolder || !accountNumber || !bankName) {
      return res.status(400).json({
        error: 'Account holder, account number, and bank name are required for bank accounts',
      });
    }

    const account = {
      id: makeId('acc'),
      nutritionistId: req.user.id,
      accountType,
      accountHolder,
      accountNumber,
      bankName,
      verified: false,
      createdAt: new Date(),
    };

    doctorPaymentAccounts.set(req.user.id, account);

    return res.status(201).json({
      account,
      message: 'Bank account added successfully. Please verify your account with your bank.',
    });
  }

  return res.status(400).json({ error: 'Invalid account type' });
});

/**
 * DELETE /nutritionist/payment-account
 * Remove payment account
 */
router.delete('/payment-account', authenticate, (req, res) => {
  if (req.user.role !== 'nutritionist') {
    return res.status(403).json({ error: 'Only nutritionists can manage payment accounts' });
  }

  if (!doctorPaymentAccounts.has(req.user.id)) {
    return res.status(404).json({ error: 'No payment account found' });
  }

  doctorPaymentAccounts.delete(req.user.id);

  return res.json({ message: 'Payment account removed successfully' });
});

/**
 * GET /nutritionist/earnings
 * Get nutritionist's earnings summary
 */
router.get('/earnings', authenticate, (req, res) => {
  if (req.user.role !== 'nutritionist') {
    return res.status(403).json({ error: 'Only nutritionists can view earnings' });
  }

  // Mock data - in production would query payments table
  const earnings = {
    totalEarnings: 450000, // In cents: 4500 RWF
    thisMonth: 150000,
    thisWeek: 45000,
    pendingPayouts: 0,
    lastPayout: {
      date: '2026-05-25',
      amount: 100000,
      method: 'mtn',
    },
  };

  return res.json(earnings);
});

export default router;
