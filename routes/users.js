import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  createUser,
  login,
  logout,
  getCurrentUser,
  updateUser,
} from '../controllers/users.js';
import { validateUserBody, validateLogin } from '../middlewares/validation.js';

const router = Router();

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateLogin, login);
router.post('/signout', logout);

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, validateUserBody, updateUser);

export default router;
