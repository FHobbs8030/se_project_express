const router = require('express').Router();
const { getClothingItems } = require('../controllers/clothes');

router.get('/', getClothingItems);

module.exports = router;
