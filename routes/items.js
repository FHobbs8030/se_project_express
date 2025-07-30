const router = require('express').Router();
const {
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
  createItem,
} = require('../controllers/clothes');

router.route('/').get(getItems).post(createItem);

router.route('/:id').delete(deleteItem);

router.put('/:id/likes', likeItem);

router.delete('/:id/likes', unlikeItem);

module.exports = router;
