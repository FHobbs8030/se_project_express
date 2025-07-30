const mongoose = require('mongoose');
const clothes = require('../models/clothingItem');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NOT_FOUND,
} = require('../utils/constants');

// Get all items
module.exports.getItems = (req, res) => {
  clothes.find({})
    .then((items) => {
      console.log('Clothing items sent to frontend:', items);
      res.status(STATUS_OK).send(items);
    })
    .catch((err) => {
      console.error('Error retrieving clothing items:', err);
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error retrieving items' });
    });
};

// Get a single item by ID
module.exports.getItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  clothes.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.status(STATUS_OK).send(item);
    })
    .catch((err) => {
      console.error(`Error retrieving item with ID ${id}:`, err);
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error retrieving item' });
    });
};

// Create a new item
module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothes.create({ name, weather, imageUrl })
    .then((item) => {
      console.log('Item created:', item);
      res.status(STATUS_CREATED).send(item);
    })
    .catch((err) => {
      console.error('Error creating item:', err);
      res.status(STATUS_BAD_REQUEST).send({ message: err.message });
    });
};

// Delete an item by ID
module.exports.deleteItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  clothes.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      console.log(`Item deleted: ${id}`);
      res.status(STATUS_OK).send({ message: 'Item deleted successfully' });
    })
    .catch((err) => {
      console.error(`Error deleting item with ID ${id}:`, err);
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error deleting item' });
    });
};

// Like an item
module.exports.likeItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  clothes.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(STATUS_OK).send(item);
    })
    .catch((err) => {
      console.error(`Error liking item with ID ${id}:`, err);
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error liking item' });
    });
};

// Unlike an item
module.exports.unlikeItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  clothes.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(STATUS_OK).send(item);
    })
    .catch((err) => {
      console.error(`Error unliking item with ID ${id}:`, err);
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server error unliking item' });
    });
};
