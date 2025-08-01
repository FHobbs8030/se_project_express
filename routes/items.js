const router = require('express').Router();
const {
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
  createItem,
} = require('../controllers/clothes');
const auth = require('../middlewares/auth');

// Public route to view items
router.get('/', getItems);

// Protected routes
router.post('/', auth, createItem);
router.delete('/:id', auth, deleteItem);
router.put('/:id/likes', auth, likeItem);
router.delete('/:id/likes', auth, unlikeItem);

module.exports = router;
