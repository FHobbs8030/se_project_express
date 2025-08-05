const router = require('express').Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
  getItem,
} = require('../controllers/clothes.js');
const auth = require('../middlewares/auth.js');
const validateObjectId = require('../middlewares/validateObjectId.js');

router.get('/', getItems);
router.get('/:id', validateObjectId('id'), getItem);
router.post('/', auth, createItem);
router.delete('/:id', auth, validateObjectId('id'), deleteItem);
router.put('/:id/likes', auth, validateObjectId('id'), likeItem);
router.delete('/:id/likes', auth, validateObjectId('id'), unlikeItem);

module.exports = router;
