const router = require('express').Router();
const clothesRouter = require('./clothes');
const usersRouter = require('./users');

router.use('/clothes', clothesRouter);
router.use('/users', usersRouter);

module.exports = router;
