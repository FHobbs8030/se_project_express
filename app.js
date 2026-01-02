import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';

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

app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT);
