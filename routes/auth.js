import { Router } from 'express';
import { createUser, login, logout } from '../controllers/users.js';
import { validateUserBody, validateLogin } from '../middlewares/validation.js';

const router = Router();

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateLogin, login);
router.post('/signout', logout);

export default router;
