// app.js
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import auth from './middlewares/auth.js';
import itemsRouter from './routes/items.js';
import usersRouter from './routes/users.js';

import { login, createUser } from './controllers/auth.js';
import { getItems } from './controllers/items.js';

import {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

dotenv.config();

const {
  PORT = 3001,
  MONGO_URL = 'mongodb://localhost:27017/wtwr_db',
  CORS_ORIGIN,
} = process.env;

const app = express();

// ---------- DB ----------
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((e) => {
    console.error('Mongo connection error:', e);
    process.exit(1);
  });

// ---------- CORS ----------
const allowList = (CORS_ORIGIN ? CORS_ORIGIN.split(',') : [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
]).map((s) => s.trim());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowList.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ---------- Parsers ----------
app.disable('x-powered-by');
app.use(express.json());

// ---------- Public routes ----------
app.get('/', (_req, res) => {
  res.send({ service: 'WTWR API', status: 'ok' });
});

app.post('/signin', login);
app.post('/signup', createUser);

// Per Sprint-13 rubric, GET /items is public
app.get('/items', getItems);

// ---------- Protected routes (scope auth to these prefixes) ----------
app.use('/users', auth, usersRouter);
app.use('/items', auth, itemsRouter);

// ---------- 404 ----------
app.use('*', (_req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

// ---------- Centralized error handler ----------
/* eslint-disable no-unused-vars */
app.use((err, _req, res, _next) => {
  let status = STATUS_INTERNAL_SERVER_ERROR;
  let message = 'An error has occurred on the server.';

  if (err.name === 'ValidationError') {
    status = STATUS_BAD_REQUEST;
    message = 'Invalid data passed to the method.';
  } else if (err.name === 'CastError') {
    status = STATUS_BAD_REQUEST;
    message = 'Invalid id format.';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = STATUS_UNAUTHORIZED;
    message = 'Authorization required.';
  } else if (err.code === 11000) {
    status = STATUS_CONFLICT;
    message = 'Email already exists.';
  } else if (err.status === STATUS_FORBIDDEN || err.status === STATUS_UNAUTHORIZED) {
    status = err.status;
    message = err.message || (status === STATUS_FORBIDDEN ? 'Forbidden.' : 'Authorization required.');
  } else if (err.status && err.message) {
    status = err.status;
    message = err.message;
  }

  res.status(status).send({ message });
});
/* eslint-enable no-unused-vars */

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`WTWR API is running on http://localhost:${PORT}`);
});
