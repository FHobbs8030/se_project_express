import { Router } from 'express';
import { getCurrentUser, updateProfile } from '../controllers/users.js';

const router = Router();

// PROTECTED (requires auth)
router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);

export default router;

