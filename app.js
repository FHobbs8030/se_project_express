import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './middlewares/auth.js';
import routes from './routes/index.js';
import { getItems } from './controllers/clothes.js';
import { STATUS_NOT_FOUND } from './utils/constants.js';

dotenv.config();

const {
  PORT = 3001,
  MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr_db',
  CORS_ORIGINS,
} = process.env;

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
];

const allowedOrigins = (CORS_ORIGINS || defaultOrigins.join(','))
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

app.use((req, _res, next) => {
  req.user = { _id: '5d8b8592978f8bd833ca8133' };
  next();
});

app.get('/items', getItems);

app.use(auth);


app.use(routes);

app.use((req, res) =>
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' }),
);

app.listen(PORT, () => {
  console.log(`WTWR API is running on http://localhost:${PORT}`);
});
