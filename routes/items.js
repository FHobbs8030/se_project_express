const router = require('express').Router();
const {
  getClothingItems,
  addClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothes');

router.route('/').get(getClothingItems).post(addClothingItem);

router.route('/:id').delete(deleteClothingItem);

router.put('/:id/likes', likeItem);

router.delete('/:id/likes', unlikeItem);

module.exports = router;
