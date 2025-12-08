import { Router } from 'express';
import authRouter from './auth.js';
import usersRouter from './users.js';
import itemsRouter from './items.js';
import auth from '../middlewares/auth.js';

const router = Router();

// PUBLIC ROUTES (NO TOKEN REQUIRED)
router.use(authRouter);

// PROTECTED ROUTES (TOKEN REQUIRED)
router.use(auth);
router.use('/users', usersRouter);
router.use('/items', itemsRouter);

// 404 HANDLER
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

export default router;
