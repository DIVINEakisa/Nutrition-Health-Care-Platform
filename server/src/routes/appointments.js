import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { appointments, makeId, roles } from '../data/mockStore.js';

const router = Router();

const appointmentSchema = z.object({
  body: z.object({
    nutritionistId: z.string(),
    concern: z.string().min(5),
    date: z.string(),
    time: z.string(),
  }),
});

router.get('/', authenticate, (req, res) => {
  if (req.user.role === roles.ADMIN) {
    return res.json({ appointments });
  }
  const scoped = appointments.filter(
    (item) => item.patientId === req.user.id || item.nutritionistId === req.user.id,
  );
  return res.json({ appointments: scoped });
});

router.post('/', authenticate, authorize(roles.PATIENT), validate(appointmentSchema), (req, res) => {
  const appointment = {
    id: makeId('apt'),
    patientId: req.user.id,
    ...req.validated.body,
    status: 'pending',
    paymentStatus: 'awaiting_payment',
  };
  appointments.push(appointment);
  return res.status(201).json({ appointment });
});

router.patch(
  '/:id/status',
  authenticate,
  authorize(roles.NUTRITIONIST, roles.ADMIN),
  (req, res) => {
    const appointment = appointments.find((item) => item.id === req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    appointment.status = req.body.status;
    return res.json({ appointment });
  },
);

router.post('/schedule', authenticate, authorize(roles.NUTRITIONIST), (req, res) => {
  return res.status(201).json({
    schedule: {
      nutritionistId: req.user.id,
      slots: req.body.slots || [],
    },
  });
});

export default router;

