import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRouter, { setSocketIOInstance } from './routes/api.js';
import { initIoTService } from './services/iotSimulator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const isOriginAllowed = (origin, callback) => {
  if (!origin || origin === CLIENT_ORIGIN || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return callback(null, true);
  }
  callback(new Error('Not allowed by CORS'));
};

app.use(cors({
  origin: isOriginAllowed,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 5000 : 300,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: isOriginAllowed, methods: ['GET', 'POST'], credentials: true }
});

setSocketIOInstance(io);
initIoTService(io);

app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), iotStreaming: true });
});

server.listen(PORT, () => {
  console.log(`Server & WebSocket running on port ${PORT}`);
  console.log(`CORS enabled for: ${CLIENT_ORIGIN}`);
});