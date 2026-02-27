import dotenv from 'dotenv';
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

dotenv.config();

const {
  PORT = 3001,
  MONGO_URI = 'mongodb://127.0.0.1:27017/wtwr_db',
  CORS_ORIGIN,
} = process.env;

mongoose.connect(MONGO_URI);

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
    origin: CORS_ORIGIN || [
      'http://localhost:5176',
      'http://localhost:5175',
      'http://localhost:5173',
      'https://fhobbs.twilightparadox.com',
    ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLogin, login);
app.post('/signout', logout);

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, '0.0.0.0');
