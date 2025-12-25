import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  createUser,
  login,
  logout,
  getCurrentUser,
  updateUser,
} from '../controllers/users.js';

const router = Router();

router.post('/signup', createUser);
router.post('/signin', login);
router.post('/logout', logout);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);

export default router;
