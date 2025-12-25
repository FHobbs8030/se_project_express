import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';
import errorHandler from './middlewares/error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr' } =
  process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
