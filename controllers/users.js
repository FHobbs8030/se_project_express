const User = require('../models/user');
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error retrieving users' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid user ID' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error retrieving user by ID' });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid user ID' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error retrieving current user' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid user data' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error creating user' });
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid update data' });
      }
      if (err.name === 'CastError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid user ID' });
      }
      if (err.message === 'NotFound') {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error updating user' });
    });
};
