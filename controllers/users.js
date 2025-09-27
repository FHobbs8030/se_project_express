// controllers/users.js
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (e) { next(e); }
}

// routes/users.js
import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { get } from '../controllers/users.js';

const router = Router();
router.get('/me', getMe); // auth is applied app-wide before /users
export default router;
