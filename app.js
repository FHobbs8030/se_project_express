import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';
import auth from './middlewares/auth.js';

import { createUser, login, logout } from './controllers/users.js';
import { validateUserBody, validateLogin } from './middlewares/validation.js';

dotenv.config();

const { PORT = 3001, MONGO_URI } = process.env;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://fhobbs.twilightparadox.com'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLogin, login);
app.post('/signout', logout);

app.use('/users', auth, usersRouter);
app.use('/items', auth, itemsRouter);

app.use(errors());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
