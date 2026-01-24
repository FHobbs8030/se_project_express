import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { getCurrentUser, updateUser } from '../controllers/users.js';
import { validateProfileUpdate } from '../middlewares/validation.js';

const router = Router();

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, validateProfileUpdate, updateUser);

export default router;
