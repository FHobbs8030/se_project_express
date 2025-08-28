import { Router } from 'express';
import { getCurrentUser, updateProfile } from '../controllers/users.js';

const router = Router();

router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);

export default router;
