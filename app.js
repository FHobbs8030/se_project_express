import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors as celebrateErrors } from 'celebrate';
import router from './routes/index.js';

const { PORT = 3001, MONGO_URL, CORS_ORIGIN, CORS_ORIGINS, JWT_SECRET } = process.env;
const DB_URL = MONGO_URL || 'mongodb://localhost:27017/wtwr_db';

const app = express();

const allowOrigins = (CORS_ORIGINS || CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.use(router);

app.use((req, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

app.use(celebrateErrors());

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = err.statusCode || 500;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    status = 400;
  } else if (err.code === 11000) {
    status = 409;
  }

  const message = err.message || (status === 500 ? 'Internal Server Error' : 'Request failed');
  res.status(status).send({ message });
});

mongoose
  .connect(DB_URL, { autoIndex: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log('Connected to MongoDB');
      if (!JWT_SECRET) console.warn('Warning: JWT_SECRET is not set');
    });
  })
  .catch((e) => {
    console.error('Mongo connection error:', e.message);
    process.exit(1);
  });
