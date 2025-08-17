import express from 'express';
import itemsRouter from './items.js';
import usersRouter from './users.js';
import { STATUS_NOT_FOUND } from '../utils/constants.js';

const router = express.Router();

router.use('/items', itemsRouter);
router.use('/users', usersRouter);

router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

export default router;
