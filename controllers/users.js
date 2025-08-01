const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user ID' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'User not found' });
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid user data' });
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { userId } = req.params;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new Error('NotFound'))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid update data' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user ID' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'User not found' });
      } else {
        next(err);
      }
    });
};
