import express from 'express';
import { errors } from 'celebrate';

import usersRouter from './routes/users.js';
import itemsRouter from './routes/items.js';
import auth from './middlewares/auth.js';

import { createUser, login, logout } from './controllers/users.js';
import { validateUserBody, validateLogin } from './middlewares/validation.js';

const app = express();

app.use(express.json());

// AUTH ROUTES
app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLogin, login);
app.post('/signout', logout);

// PROTECTED ROUTES
app.use('/users', auth, usersRouter);
app.use('/items', auth, itemsRouter);

// ERROR HANDLING
app.use(errors());

app.listen(3001, () => {});
