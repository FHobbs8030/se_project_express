import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';
import errorHandler from './middlewares/error-handler.js';

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr' } =
  process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(
  cors({
    origin: 'http://localhost:5175',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/images', express.static('public/images'));

app.use(authRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
