const router = require('express').Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
  getItem,
} = require('../controllers/clothes');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');

router.get('/', getItems);
router.get('/:id', validateObjectId('id'), getItem);
router.post('/', auth, createItem);
router.delete('/:id', auth, validateObjectId('id'), deleteItem);
router.put('/:id/likes', auth, validateObjectId('id'), likeItem);
router.delete('/:id/likes', auth, validateObjectId('id'), unlikeItem);

module.exports = router;
