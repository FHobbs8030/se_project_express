import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { login, createUser } from './controllers/auth.js';
import { getItems } from './controllers/items.js';
import auth from './middlewares/auth.js';
import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';

import {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

const app = express();

const { PORT = 3001, MONGO_URL, CORS_ORIGIN, CORS_ORIGINS } = process.env;
const DEFAULT_MONGO = 'mongodb://localhost:27017/wtwr_db';

// Build CORS allow list from either CORS_ORIGIN or CORS_ORIGINS
const allowList = (
  CORS_ORIGIN || CORS_ORIGINS
    ? (CORS_ORIGIN || CORS_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174']
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowList.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// ensure CORS preflights are handled
app.options('*', cors(corsOptions));

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

// ---- Health / root ----
app.get('/', (_req, res) => {
  res.status(STATUS_OK).send({ status: 'ok', routes: ['/signin', '/signup', '/items', '/users/me'] });
});

// ---- Public routes ----
app.post('/signin', login);
app.post('/signup', createUser);

// Public items list (kept open per Sprint-13)
app.get('/items', getItems);

// ---- Protected routes ----
app.use('/users', auth, usersRouter);
app.use('/items', auth, itemsRouter);

// ---- 404 for unknown paths ----
app.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

// ---- Centralized error handler ----
app.use((err, _req, res, _next) => {
  if (_next) { /* no-op to satisfy ESLint */ }

  let status = err.statusCode || STATUS_INTERNAL_SERVER_ERROR;

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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
