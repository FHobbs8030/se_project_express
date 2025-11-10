import { Router } from 'express';
import auth from '../middleware/auth.js';
import { signup, signin, getMe, signout } from '../controllers/users.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/users/me', auth, getMe);
router.post('/users/signout', auth, signout);

export default router;
