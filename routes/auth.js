import { Router } from 'express';
import { createUser, login, logout } from '../controllers/users.js';

const router = Router();

router.post('/users/signup', createUser);
router.post('/signin', login);
router.post('/signout', logout);

export default router;
