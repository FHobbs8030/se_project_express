const ClothingItem = require('../models/clothingItem');
const {
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_OK).send(items))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error' }));
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(STATUS_CREATED).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid input data' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error' });
      }
    });
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error('NotFound'))
    .then((item) => res.status(STATUS_OK).send(item))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      } else {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
    });
};

module.exports.unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error('NotFound'))
    .then((item) => res.status(STATUS_OK).send(item))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      } else {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
    });
};
