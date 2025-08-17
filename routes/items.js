import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} from '../controllers/clothes.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = express.Router();

// GET /items (public in Sprint 12)
router.get('/', getItems);

// POST /items
router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      weather: Joi.string().valid('hot', 'warm', 'cold').required(),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem,
);

// DELETE /items/:id
router.delete('/:id', validateObjectId('id'), deleteItem);

// PUT /items/:id/likes
router.put('/:id/likes', validateObjectId('id'), likeItem);

// DELETE /items/:id/likes
router.delete('/:id/likes', validateObjectId('id'), unlikeItem);

export default router;
