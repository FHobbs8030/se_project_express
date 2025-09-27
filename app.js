console.log('[boot] app.js starting');

import dotenv from 'dotenv';
dotenv.config();

console.log('[boot] env loaded PORT=%s MONGO_URL=%s', process.env.PORT, process.env.MONGO_URL);

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errors } from 'celebrate';

import auth from './middlewares/auth.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/wtwr_db';

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// TEMP health route (helps debugging)
app.get('/health', (_req, res) => res.json({ ok: true }));

console.log('[boot] mounting public routes');
app.use(authRouter);

console.log('[boot] mounting auth middleware');
app.use(auth);

console.log('[boot] mounting protected routes');
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.use(errors());
// app.use(centralErrorHandler); // keep yours if present

(async () => {
  try {
    console.log('[boot] connecting Mongo:', MONGO_URL);
    await mongoose.connect(MONGO_URL, {
      dbName: 'wtwr',
      serverSelectionTimeoutMS: 5000, // fail fast instead of hanging forever
    });
    console.log('[boot] Mongo connected');
    console.log('[boot] about to call app.listen on', PORT);
    app.listen(PORT, () => console.log(`[server] listening http://localhost:${PORT}`));
  } catch (err) {
    console.error('[boot] Mongo connect FAILED:', err?.message || err);
    process.exit(1);
  }
})();
