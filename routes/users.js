import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import auth from '../middlewares/auth.js';
import { getMe, updateMe } from '../controllers/users.js';

const router = Router();

router.get('/users/me', auth, getMe);

router.patch(
  '/users/me',
  auth,
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(2).max(30).optional(),
      avatar: Joi.string().uri().optional(),
    }).min(1),
  }),
  updateMe,
);

export default router;
