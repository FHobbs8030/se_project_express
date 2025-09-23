// routes/items.js
import { Router } from 'express';
import { getItems, createItem, deleteItem } from '../controllers/items.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.get('/items', auth, getItems);
router.post('/items', auth, createItem);
router.delete('/items/:itemId', auth, deleteItem);

export default router;
