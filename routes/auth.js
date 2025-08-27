import { Router } from 'express';
import { createUser, login } from '../controllers/auth.js';

const router = Router();

// PUBLIC
router.post('/signin', login);
router.post('/signup', createUser);

export default router;
