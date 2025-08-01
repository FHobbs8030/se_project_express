import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes/index';
import { createUser, login } from './middlewares/auth';

const auth = require('./middlewares/auth');

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'An internal server error occurred'
      : message,
  });
});

app.listen(PORT, () => {
  console.log(`✅ WTWR API is running on http://localhost:${PORT}`);
});
