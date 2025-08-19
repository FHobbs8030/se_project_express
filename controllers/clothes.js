import ClothingItem from '../models/clothingItem.js';
import {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} from '../utils/constants.js';

// GET /items
export const getItems = async (_req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.status(STATUS_OK).send(items);
  } catch (_err) {
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Failed to fetch items' });
  }
};

// POST /items
export const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    // eslint-disable-next-line no-undef
    const newItem = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(STATUS_CREATED).send(newItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item data' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Failed to create item' });
  }
};

// DELETE /items/:id
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ClothingItem.findById(id);
    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }
    // Optional owner check (fine for Sprint 12 to include, but no real auth):
    if (String(item.owner) !== String(req.user?._id)) {
      return res.status(STATUS_FORBIDDEN).send({ message: 'You can only delete your own items' });
    }
    await item.deleteOne();
    return res.status(STATUS_OK).send({ message: 'Item deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Failed to delete item' });
  }
};

// PUT /items/:id/likes
export const likeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const updated = await ClothingItem.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!updated) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }
    return res.status(STATUS_OK).send(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Failed to like item' });
  }
};

// DELETE /items/:id/likes
export const unlikeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const updated = await ClothingItem.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updated) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }
    return res.status(STATUS_OK).send(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Failed to unlike item' });
  }
};
