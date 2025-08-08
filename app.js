import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/index.js';
import auth from './middlewares/auth.js';
import { createUser, login } from './controllers/auth.js';
import { getItems, getItem } from './controllers/clothes.js';

dotenv.config();

const { PORT = 3001, MONGO_URL } = process.env;

const app = express();

mongoose
  .connect(MONGO_URL || 'mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.get('/items', getItems);
app.get('/items/:id', getItem);

app.use(auth);
app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An internal server error occurred' : message,
  });
});

app.listen(PORT, () => {
  console.log(`WTWR API is running on http://localhost:${PORT}`);
});
