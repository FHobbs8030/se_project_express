const router = require('express').Router();
const { getClothingItems, createClothingItem } = require('../controllers/clothes');

router.get('/', getClothingItems);
router.post('/', createClothingItem); // ← add this line

module.exports = router;
