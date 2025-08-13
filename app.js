import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';

import routes from './routes/index.js';
import auth from './middlewares/auth.js';
import { createUser, login } from './controllers/auth.js';
import { getItems, getItem } from './controllers/clothes.js';

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

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: '5d8b8592978f8bd833ca8133' };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.get('/items', getItems);
app.get('/items/:id', getItem);

app.use(auth);
app.use(routes);

app.use(errors());

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An internal server error occurred' : message,
  });
});

app.listen(PORT, () => {
  console.log(`WTWR API is running on http://localhost:${PORT}`);
});
