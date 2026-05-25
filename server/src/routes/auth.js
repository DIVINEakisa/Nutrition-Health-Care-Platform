import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { issueToken, authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { makeId, roles, users } from '../data/mockStore.js';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([roles.ADMIN, roles.NUTRITIONIST, roles.PATIENT]).default(roles.PATIENT),
    specialty: z.string().optional(),
    licenseNumber: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password, role, specialty, licenseNumber } = req.validated.body;
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  const user = {
    id: makeId('usr'),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    specialty,
    licenseNumber,
    status: role === roles.NUTRITIONIST ? 'pending_verification' : 'active',
  };
  users.push(user);

  const { passwordHash, ...safeUser } = user;
  return res.status(201).json({ user: safeUser, token: issueToken(user) });
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated.body;
  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isDevelopmentMock = user.passwordHash === '$2a$10$development';
  const isValid = isDevelopmentMock || (await bcrypt.compare(password, user.passwordHash));
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const { passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser, token: issueToken(user) });
});

router.post('/forgot-password', (req, res) => {
  return res.json({
    message: 'If the email exists, a password reset link will be sent.',
    resetTokenPreview: 'development-reset-token',
  });
});

router.get('/me', authenticate, (req, res) => {
  const { passwordHash, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

router.patch('/me', authenticate, (req, res) => {
  Object.assign(req.user, req.body);
  const { passwordHash, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

export default router;

