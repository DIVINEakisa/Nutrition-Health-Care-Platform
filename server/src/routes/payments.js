import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPaymentIntent } from '../services/stripeService.js';
import { makeId, payments } from '../data/mockStore.js';

const router = Router();

const intentSchema = z.object({
  body: z.object({
    appointmentId: z.string().optional(),
    courseId: z.string().optional(),
    amountCents: z.number().int().positive(),
  }),
});

router.get('/', authenticate, (req, res) => {
  return res.json({
    payments: payments.filter((payment) => payment.userId === req.user.id || req.user.role === 'admin'),
  });
});

router.post('/intent', authenticate, validate(intentSchema), async (req, res, next) => {
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

router.post('/confirm', authenticate, (req, res) => {
  const payment = {
    id: makeId('pay'),
    userId: req.user.id,
    appointmentId: req.body.appointmentId,
    amountCents: req.body.amountCents,
    status: 'confirmed',
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  payments.push(payment);
  return res.status(201).json({ payment });
});

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
      lineItems: ['Nutrition healthcare service'],
    },
  });
});

export default router;

