import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import appointmentRoutes from './routes/appointments.js';
import paymentRoutes from './routes/payments.js';
import chatRoutes from './routes/chat.js';
import nutritionistRoutes from './routes/nutritionists.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.set('io', io);

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'nutrition-healthcare-api',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/nutritionists', nutritionistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

io.on('connection', (socket) => {
  socket.on('consultation:join', ({ appointmentId }) => {
    socket.join(appointmentId);
    socket.to(appointmentId).emit('notification:new', {
      type: 'consultation',
      message: 'A participant joined the consultation room.',
    });
  });

  socket.on('disconnect', () => {});
});

app.use(notFound);
app.use(errorHandler);

server.listen(env.port, () => {
  console.log(`Nutrition healthcare API listening on http://localhost:${env.port}`);
});

