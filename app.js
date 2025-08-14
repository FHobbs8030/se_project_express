import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';

import routes from './routes/index.js';
import auth from './middlewares/auth.js';
import { createUser, login } from './controllers/auth.js';
import { getItems } from './controllers/clothes.js';
import {
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} from './utils/constants.js';

dotenv.config();

['MONGO_URL', 'JWT_SECRET'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env: ${key}`);
    process.exit(1);
  }
});

const { PORT = 3001, MONGO_URL } = process.env;

const app = express();

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].join(',');

const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    const isPublicItemsGet =
      req.method === 'GET' && (req.path === '/items' || req.path.startsWith('/items/'));
    if (isPublicItemsGet) {
      req.user = { _id: '5d8b8592978f8bd833ca8133' };
    }
    next();
  });
}

app.post('/signin', login);
app.post('/signup', createUser);

app.get('/items', getItems);

app.use(auth);
app.use(routes);

app.use(errors());

app.use((req, res) => {
  return res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
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
