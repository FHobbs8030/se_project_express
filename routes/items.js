import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { listItems, createItem, deleteItem, likeItem, unlikeItem } from '../controllers/items.js';

const router = Router();

router.get('/', listItems);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      imageUrl: Joi.string().uri().required(),
      weather: Joi.string().valid('hot', 'warm', 'cold').required(),
    }),
  }),
  createItem
);

router.delete(
  '/:itemId',
  celebrate({ [Segments.PARAMS]: Joi.object({ itemId: Joi.string().hex().length(24).required() }) }),
  deleteItem
);

// (only if you implemented likes)
router.put(
  '/:itemId/likes',
  celebrate({ [Segments.PARAMS]: Joi.object({ itemId: Joi.string().hex().length(24).required() }) }),
  likeItem
);
router.delete(
  '/:itemId/likes',
  celebrate({ [Segments.PARAMS]: Joi.object({ itemId: Joi.string().hex().length(24).required() }) }),
  unlikeItem
);

export default router;   // <<— IMPORTANT
