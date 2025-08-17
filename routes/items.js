import express from 'express';
import {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} from '../controllers/clothes.js';

const router = express.Router();

router.get('/', getItems);
router.post('/', createItem);
router.delete('/:id', deleteItem);
router.put('/:id/likes', likeItem);
router.delete('/:id/likes', unlikeItem);

export default router;
