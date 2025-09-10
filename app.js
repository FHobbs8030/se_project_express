import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

const app = express();

const { PORT = 3001, MONGO_URL, CORS_ORIGIN, CORS_ORIGINS } = process.env;
const DEFAULT_MONGO = 'mongodb://localhost:27017/wtwr_db';

const allowList = (CORS_ORIGIN || CORS_ORIGINS)
  ? (CORS_ORIGIN || CORS_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowList.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use(
  '/static',
  express.static(path.join(process.cwd(), 'public'), {
    index: false,
    maxAge: '7d',
    etag: true,
  }),
);

app.use(router);

mongoose
  .connect(MONGO_URL || DEFAULT_MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use((err, _req, res, _next) => {
  // mark `_next` as used without calling it (satisfies no-unused-vars, avoids no-void)
  Boolean(_next);

  let status = err.statusCode || STATUS_INTERNAL_SERVER_ERROR;

  if (!err.statusCode) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      status = STATUS_BAD_REQUEST;
    } else if (err.code === 11000) {
      status = STATUS_CONFLICT;
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      status = STATUS_UNAUTHORIZED;
    }
  }

  const message = status === STATUS_INTERNAL_SERVER_ERROR
    ? 'An error has occurred on the server.'
    : err.message || 'An error occurred';

  res.status(status).send({ message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
