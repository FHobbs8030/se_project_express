import { Router } from 'express';
import { getCurrentUser, getUserById, updateUser } from '../controllers/users.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/me', getCurrentUser);
router.get('/:userId', validateObjectId, getUserById);
router.patch('/me', updateUser);

export default router;
