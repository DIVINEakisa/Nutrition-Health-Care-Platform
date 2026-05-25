import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { makeId, messages } from '../data/mockStore.js';

const router = Router();

router.get('/:appointmentId/messages', authenticate, (req, res) => {
  return res.json({
    messages: messages.filter((message) => message.appointmentId === req.params.appointmentId),
  });
});

router.post('/:appointmentId/messages', authenticate, (req, res) => {
  const message = {
    id: makeId('msg'),
    appointmentId: req.params.appointmentId,
    senderId: req.user.id,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  req.app.get('io')?.to(req.params.appointmentId).emit('message:new', message);
  return res.status(201).json({ message });
});

export default router;

