import { Router } from 'express';
import { roles, users } from '../data/mockStore.js';

const router = Router();

router.get('/', (req, res) => {
  const nutritionists = users
    .filter((user) => user.role === roles.NUTRITIONIST)
    .map(({ passwordHash, ...safeUser }) => ({
      ...safeUser,
      rating: 4.9,
      availableSlots: ['2026-05-27T10:30:00.000Z', '2026-05-28T15:00:00.000Z'],
    }));
  return res.json({ nutritionists });
});

export default router;

