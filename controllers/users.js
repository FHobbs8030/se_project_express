const mongoose = require('mongoose');
const User = require('../models/user');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NOT_FOUND,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(STATUS_OK).send(users))
  .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({
    message: 'Server error while retrieving users',
  }));

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user ID' });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Server error while retrieving user',
    }));
};

module.exports.createUser = (req, res) => {
  const {
    name,
    avatar,
  } = req.body;

  return User.create({
    name,
    avatar,
  })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => res.status(STATUS_BAD_REQUEST).send({ message: err.message }));
};
