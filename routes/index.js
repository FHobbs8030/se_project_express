import express from 'express';
import itemsRouter from './items.js';
import { STATUS_NOT_FOUND } from '../utils/constants.js';

const router = express.Router();

router.use('/items', itemsRouter);

// 404 (should be last)
router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested resource not found' });
});

export default router;
