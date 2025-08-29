import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import usersController from './controllers/users.js'; // default import
import { getItems } from './controllers/items.js';
import auth from './middlewares/auth.js';
import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';

import {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

const app = express();

// ---- Basic config ----
const { PORT = 3001, MONGO_URL, CORS_ORIGIN, CORS_ORIGINS } = process.env;
const DEFAULT_MONGO = 'mongodb://localhost:27017/wtwr_db';

// Allow list from env: CORS_ORIGIN or CORS_ORIGINS=comma,separated,urls
const allowList = (CORS_ORIGIN || CORS_ORIGINS
  ? (CORS_ORIGIN || CORS_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174']
);

const corsOptions = {
  origin(origin, callback) {
    // allow REST tools / same-origin (no Origin header) and allowListed origins
    if (!origin || allowList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ---- DB ----
mongoose
  .connect(MONGO_URL || DEFAULT_MONGO)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---- Public routes ----
app.post('/signin', usersController.login);
app.post('/signup', usersController.createUser);

// Public items list
app.get('/items', getItems);

// ---- Protected routes ----
app.use(auth);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// ---- 404 for unknown paths ----
app.use((req, res, _next) => {
  // touch _next so ESLint doesn't flag it (no-op)
  if (_next) { /* noop */ }
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

// ---- Centralized error handler ----
app.use((err, _req, res, _next) => {
  // touch _next so ESLint doesn't flag it (no-op)
  if (_next) { /* noop */ }

  let status = err.statusCode || STATUS_INTERNAL_SERVER_ERROR;

  // Map common cases when statusCode isn’t set
  if (!err.statusCode) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      status = STATUS_BAD_REQUEST;
    } else if (err.code === 11000) {
      status = STATUS_CONFLICT;
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      status = STATUS_UNAUTHORIZED;
    }
  }

  const message = status === STATUS_INTERNAL_SERVER_ERROR
    ? 'An error has occurred on the server.'
    : (err.message || 'An error occurred');

  res.status(status).send({ message });
});

// ---- Start server ----
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
