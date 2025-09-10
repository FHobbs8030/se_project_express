import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { signup, signin } from '../controllers/auth.js';
import { getItems } from '../controllers/items.js';
import auth from '../middlewares/auth.js';
import itemsRouter from './items.js';
import usersRouter from './users.js';

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

// PUBLIC: anyone can fetch clothing items
router.get('/items', getItems);

// Everything below this line requires a valid JWT
router.use(auth);

// Protected items routes (create/delete)
router.use(itemsRouter);

// Protected user routes (profile, etc.)
router.use(usersRouter);

export default router;
