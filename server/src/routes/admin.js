import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { appointments, courses, payments, roles, users } from '../data/mockStore.js';

const router = Router();

router.use(authenticate, authorize(roles.ADMIN));

router.get('/analytics', (req, res) => {
  return res.json({
    analytics: {
      activePatients: users.filter((user) => user.role === roles.PATIENT).length,
      doctors: users.filter((user) => user.role === roles.NUTRITIONIST).length,
      courses: courses.length,
      appointments: appointments.length,
      revenueCents: payments.reduce((total, payment) => total + payment.amountCents, 0),
    },
  });
});

router.get('/users', (req, res) => {
  return res.json({
    users: users.map(({ passwordHash, ...safeUser }) => safeUser),
  });
});

router.patch('/users/:id/status', (req, res) => {
  const user = users.find((item) => item.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  user.status = req.body.status;
  const { passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

router.patch('/courses/:id/moderation', (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }
  course.status = req.body.status;
  return res.json({ course });
});

export default router;
