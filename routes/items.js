import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  getItems,
  createItem,
  likeItem,
  unlikeItem,
  deleteItem,
} from '../controllers/items.js';
import { validateCardBody, validateItemId } from '../middlewares/validation.js';

console.log('ITEMS ROUTER LOADED');

const router = Router();

router.get('/', getItems);
router.post('/', auth, validateCardBody, createItem);
router.put('/:itemId/likes', auth, validateItemId, likeItem);
router.delete('/:itemId/likes', auth, validateItemId, unlikeItem);
router.delete('/:itemId', auth, validateItemId, deleteItem);

export default router;
