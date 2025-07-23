const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({ message: 'Server error while retrieving users' }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then(user => res.status(201).send(user))
    .catch(err => res.status(400).send({ message: err.message }));
};
