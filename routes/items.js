// src/routes/items.js
import { Router } from 'express';
import {
  getItems,
  createItem,
  likeItem,
  unlikeItem,
  deleteItem,
} from '../controllers/items.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', getItems);
router.post('/', createItem);
router.put('/:itemId/likes', validateObjectId('itemId'), likeItem);
router.delete('/:itemId/likes', validateObjectId('itemId'), unlikeItem);
router.delete('/:itemId', validateObjectId('itemId'), deleteItem);

export default router;
