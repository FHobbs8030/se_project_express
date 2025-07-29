const router = require('express').Router();
const {
  getClothingItems,
  addClothingItem,
  deleteClothingItem,
} = require('../controllers/clothes');

router.route('/').get(getClothingItems).post(addClothingItem);
router.route('/:id').delete(deleteClothingItem);

module.exports = router;
