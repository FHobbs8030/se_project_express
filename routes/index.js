import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { signup, signin } from '../controllers/auth.js';
import { getItems } from '../controllers/items.js';
import auth from '../middlewares/auth.js';
import usersRouter from './users.js';
import itemsRouter from './items.js';

const router = Router();

router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      avatar: Joi.string().uri().optional(),
    }),
  }),
  signup,
);

router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  signin,
);

// PUBLIC list endpoint
router.get('/items', getItems);

// Auth-only below
router.use(auth);
router.use(usersRouter);
router.use(itemsRouter);

export default router;
