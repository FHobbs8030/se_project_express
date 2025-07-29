const router = require('express').Router();
const {
  getClothingItems,
  createClothingItem,
  likeItem,
  unlikeItem,
  deleteClothingItem,
} = require('../controllers/clothes');

router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.put('/:id/likes', likeItem);
router.delete('/:id/likes', unlikeItem);
router.delete('/:id', deleteClothingItem);

module.exports = router;
