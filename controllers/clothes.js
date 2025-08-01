const mongoose = require('mongoose');
const clothes = require('../models/clothingItem');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NOT_FOUND,
} = require('../utils/constants');

// GET /items
module.exports.getItems = (req, res) => {
  clothes.find({})
    .then((items) => res.status(STATUS_OK).send(items))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error retrieving items' }));
};

// GET /items/:id
module.exports.getItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  return clothes.findById(id)
    .then((item) => {
      if (item) {
        return res.status(STATUS_OK).send(item);
      }
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    })
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error retrieving item' }));
};

// POST /items
module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothes.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(STATUS_CREATED).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item data' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error creating item' });
    });
};

// DELETE /items/:id
module.exports.deleteItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  return clothes.findByIdAndDelete(id)
    .then((item) => {
      if (item) {
        return res.status(STATUS_OK).send({ message: 'Item deleted successfully' });
      }
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    })
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error deleting item' }));
};

// PUT /items/:id/likes
module.exports.likeItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  return clothes.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (item) {
        return res.status(STATUS_OK).send(item);
      }
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    })
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error liking item' }));
};

// DELETE /items/:id/likes
module.exports.unlikeItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  return clothes.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (item) {
        return res.status(STATUS_OK).send(item);
      }
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    })
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error unliking item' }));
};
