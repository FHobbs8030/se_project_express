import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  getItems,
  createItem,
  likeItem,
  unlikeItem,
  deleteItem,
} from '../controllers/items.js';

const router = Router();

router.get('/', getItems);
router.post('/', auth, createItem);
router.put('/:itemId/likes', auth, likeItem);
router.delete('/:itemId/likes', auth, unlikeItem);
router.delete('/:itemId', auth, deleteItem);

export default router;
