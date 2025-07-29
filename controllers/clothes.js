const ClothingItem = require('../models/clothingItem');
const mongoose = require('mongoose');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_OK).send(items))
    .catch(() =>
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error while retrieving items' })
    );
};

module.exports.addClothingItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(STATUS_CREATED).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error while creating item' });
    });
};

module.exports.likeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error('NotFound'))
    .then((item) => res.status(STATUS_OK).send(item))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error while liking item' });
    });
};

module.exports.unlikeItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error('NotFound'))
    .then((item) => res.status(STATUS_OK).send(item))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error while unliking item' });
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  ClothingItem.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(STATUS_OK).send({ message: 'Item deleted successfully' });
    })
    .catch(() =>
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error while deleting item' })
    );
};
