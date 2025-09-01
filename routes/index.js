import { Router } from 'express';

import auth from '../middlewares/auth.js';
import { login, createUser } from '../controllers/auth.js';
import { getItems } from '../controllers/items.js';
import usersRouter from './users.js';
import itemsRouter from './items.js';

import { STATUS_OK, STATUS_NOT_FOUND } from '../utils/constants.js';

const router = Router();

// ---- Public routes ----
router.get('/', (_req, res) => {
  res.status(STATUS_OK).send({ status: 'ok', routes: ['/signin', '/signup', '/items', '/users/me'] });
});

router.post('/signin', login);
router.post('/signup', createUser);
router.get('/items', getItems);

// ---- Protected routes ----
router.use(auth);
router.use('/users', usersRouter);
router.use('/items', itemsRouter);

// ---- 404 for unknown paths ----
router.use('*', (_req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

export default router;
