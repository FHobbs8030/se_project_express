import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { Types } from 'mongoose';

import auth from '../middlewares/auth.js';
import { createItem, deleteItem } from '../controllers/items.js';

const router = Router();

router.post(
  '/items',
  auth,
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      weather: Joi.string().valid('hot', 'warm', 'cold').required(),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem,
);

router.delete(
  '/items/:itemId',
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object({
      itemId: Joi.string().custom((v, helpers) => (
        Types.ObjectId.isValid(v) ? v : helpers.error('any.invalid')
      )),
    }),
  }),
  deleteItem,
);

export default router;
