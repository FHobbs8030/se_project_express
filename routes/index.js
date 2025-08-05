import express from 'express';
import itemsRouter from './items.js';
import usersRouter from './users.js';

const router = express.Router();

router.use('/items', itemsRouter);
router.use('/users', usersRouter);

// 404 middleware (must be last)
router.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

export default router;
