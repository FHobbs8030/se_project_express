import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { errors } from 'celebrate';
import router from './routes/index.js';

const app = express();

const {
  PORT = 3001,
  MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr',
  NODE_ENV = 'development',
  CORS_ORIGINS = '',
} = process.env;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  ...CORS_ORIGINS.split(',')
    .map(s => s.trim())
    .filter(Boolean),
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.set('trust proxy', 1);
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.send('ok'));

app.use(router);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errors());

app.use((err, _req, res, _next) => {
  const status = err.statusCode || err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ message });
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`API listening on ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
