import { Router } from 'express';
import {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} from '../controllers/items.js';

const router = Router();

// The rest should be protected by your global auth middleware in app.js
router.get('/:id', getItem);
router.post('/', createItem);
router.delete('/:id', deleteItem);
router.put('/:id/likes', likeItem);
router.delete('/:id/likes', unlikeItem);

export default router;
