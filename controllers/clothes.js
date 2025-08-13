import ClothingItem from '../models/clothingItem.js';
import {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NOT_FOUND,
} from '../utils/constants.js';

// Get all items
export const getItems = async (_req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.status(STATUS_OK).send(items);
  } catch (_err) {
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Server error retrieving items' });
  }
};

// Create new item
export const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(STATUS_CREATED).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid item data' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error creating item' });
    });
};

// Delete item by ID
export const deleteItem = (req, res) => {
  const { id } = req.params;

  return ClothingItem.findByIdAndDelete(id)
    .then((item) =>
      !item
        ? res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' })
        : res.status(STATUS_OK).send({ message: 'Item deleted successfully' }),
    )
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid item ID' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error deleting item' });
    });
};

// Like an item
export const likeItem = (req, res) => {
  const { id } = req.params;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((item) =>
      !item
        ? res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' })
        : res.status(STATUS_OK).send(item),
    )
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid item ID' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error liking item' });
    });
};

// Unlike an item
export const unlikeItem = (req, res) => {
  const { id } = req.params;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((item) =>
      !item
        ? res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' })
        : res.status(STATUS_OK).send(item),
    )
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid item ID' });
      }
      return res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error unliking item' });
    });
};
