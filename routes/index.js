const router = require('express').Router();
const itemsRouter = require('./items');
const usersRouter = require('./users');

router.use('/items', itemsRouter);
router.use('/users', usersRouter);

// 404 middleware
router.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;
