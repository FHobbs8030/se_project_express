import { Router } from 'express';
import users from './users.js';
import auth from './auth.js';
import items from './items.js';

const router = Router();

router.use(auth);
router.use('/users', users);
router.use(items);

export default router;
