const router = require('express').Router();
const {
  getClothingItems,
  createClothingItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothes');

router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.put('/:id/likes', likeItem);
router.delete('/:id/likes', unlikeItem); 

module.exports = router;
