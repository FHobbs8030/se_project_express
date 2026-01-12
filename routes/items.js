import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  getItems,
  createItem,
  likeItem,
  unlikeItem,
  deleteItem,
} from '../controllers/items.js';
import { validateCardBody, validateId } from '../middlewares/validation.js';

const router = Router();

router.get('/', getItems);
router.post('/', auth, validateCardBody, createItem);
router.put('/:itemId/likes', auth, validateId, likeItem);
router.delete('/:itemId/likes', auth, validateId, unlikeItem);
router.delete('/:itemId', auth, validateId, deleteItem);

export default router;
