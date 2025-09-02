import { Router } from 'express';
import itemsRouter from './items.js';
import usersRouter from './users.js';
import { createUser, login } from '../controllers/auth.js';
import { getItems } from '../controllers/items.js';
import auth from '../middlewares/auth.js';

const router = Router();

// Auth (public)
router.post('/signup', createUser);
router.post('/signin', login);

// Public route
router.get('/items', getItems);

// Protected routes
router.use('/items', auth, itemsRouter);
router.use('/users', auth, usersRouter);

export default router;
