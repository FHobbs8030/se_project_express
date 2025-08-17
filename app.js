import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes/index.js';
import hardcodedUser from './middlewares/hardcodedUser.js';
import {
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

dotenv.config();

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr_db' } = process.env;

const app = express();

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(hardcodedUser);
app.use(routes);

app.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR, message } = err;
  return res.status(statusCode).send({
    message:
      statusCode === STATUS_INTERNAL_SERVER_ERROR
        ? 'An internal server error occurred'
        : message,
  });
});

app.listen(PORT, () => {
  console.log(`WTWR API is running on http://localhost:${PORT}`);
});
