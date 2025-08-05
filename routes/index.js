const router = require('express').Router();
const itemsRouter = require('./items.js');
const usersRouter = require('./users.js');

router.use('/items', itemsRouter);
router.use('/users', usersRouter);

// 404 middleware
router.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;
