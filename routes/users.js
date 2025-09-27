// routes/users.js
import { Router } from 'express';
import { getMe } from '../controllers/users.js';

const router = Router();

// auth middleware is applied app-wide in app.js BEFORE this router
router.get('/me', getMe);

export default router;
