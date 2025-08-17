import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';

import routes from './routes/index.js';
import hardcodedUser from './middlewares/hardcodedUser.js';
import {
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

dotenv.config();

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr_db' } = process.env;

const app = express();

// connect to Mongo
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// Sprint-12: use hardcoded user id middleware (no real auth yet)
app.use(hardcodedUser);

// Mount app routes
app.use(routes);

// Celebrate validation errors
app.use(errors());

// Fallback 404 (in case something slips past router 404)
app.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

// Centralized error handler
app.use((err, _req, res, _next) => {
  if (res.headersSent) return;
  const { statusCode = STATUS_INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === STATUS_INTERNAL_SERVER_ERROR
        ? 'An internal server error occurred'
        : message,
  });
});

app.listen(PORT, () => {
  console.log(`WTWR API is running on http://localhost:${PORT}`);
});
