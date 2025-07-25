const User = require('../models/user');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() =>
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error while retrieving users' })
    );
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) =>
      res.status(STATUS_BAD_REQUEST).send({ message: err.message })
    );
};

