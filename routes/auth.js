// routes/auth.js (ESM)
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { signin, signup } from '../controllers/auth.js';

const router = Router();

router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  signup
);

router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  signin
);

export default router;
