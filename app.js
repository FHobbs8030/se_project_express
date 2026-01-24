import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { errors } from 'celebrate';
import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { createUser, login, logout } from './controllers/users.js';
import { validateUserBody, validateLogin } from './middlewares/validation.js';

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr_db' } =
  process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5175',
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

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLogin, login);
app.post('/signout', logout);

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.use((req, res, next) => {
  const error = new Error('Requested resource not found');
  error.statusCode = 404;
  next(error);
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

app.listen(PORT);
