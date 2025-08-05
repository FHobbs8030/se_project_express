import express from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
  getItem,
} from '../controllers/clothes.js';

import auth from '../middlewares/auth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', validateObjectId('id'), getItem);

router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      weather: Joi.string().required(),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem,
);

router.delete('/:id', auth, validateObjectId('id'), deleteItem);
router.put('/:id/likes', auth, validateObjectId('id'), likeItem);
router.delete('/:id/likes', auth, validateObjectId('id'), unlikeItem);

export default router;
