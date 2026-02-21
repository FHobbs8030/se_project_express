import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { errors } from 'celebrate';

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';

import { requestLogger, errorLogger } from './middlewares/logger.js';
import errorHandler from './middlewares/error-handler.js';

import { createUser, login, logout } from './controllers/users.js';
import { validateUserBody, validateLogin } from './middlewares/validation.js';

import NotFoundError from './utils/errors/NotFoundError.js';

const {

PORT = 3001,

MONGO_URI = 'mongodb://127.0.0.1:27017/wtwr_db',

CORS_ORIGIN

} = process.env;

mongoose.connect(MONGO_URI);

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
<<<<<<< HEAD
    origin: [
      'http://localhost:5175',
      'http://localhost:5173',
      'https://fhobbs.twilightparadox.com',
    ],
=======
    origin: CORS_ORIGIN,
>>>>>>> 7e197c5 (Update auth, user model, and app configuration)
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  return next();
});

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(express.static(path.join(process.cwd(), 'public')));

/* ---------- Crash Test Route ---------- */

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

/* ---------- Auth Routes ---------- */

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLogin, login);
app.post('/signout', logout);

/* ---------- Main Routes ---------- */

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

/* ---------- 404 Handler ---------- */

app.use((req, res, next) => {
  return next(new NotFoundError('Requested resource not found'));
});

/* ---------- Error Logging ---------- */

app.use(errorLogger);

/* ---------- Celebrate Errors ---------- */

app.use(errors());

<<<<<<< HEAD
/* ---------- Centralized Error Handler ---------- */

app.use(errorHandler);
=======
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});
>>>>>>> 7e197c5 (Update auth, user model, and app configuration)

app.listen(PORT, '0.0.0.0');
