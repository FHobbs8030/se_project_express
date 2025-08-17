import express from 'express';
import { createItem, deleteItem, likeItem, unlikeItem } from '../controllers/clothes.js';

const router = express.Router();

// Sprint-12: no auth middleware, no validation middleware
// Hardcoded user _id is set in app.js

router.post('/', createItem);
router.delete('/:id', deleteItem);
router.put('/:id/likes', likeItem);
router.delete('/:id/likes', unlikeItem);

export default router;
