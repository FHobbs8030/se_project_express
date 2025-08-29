// controllers/items.js
import ClothingItem from '../models/clothingItem.js';
import {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} from '../utils/constants.js';

const POP_OWNER = { path: 'owner', select: 'name email avatar' };
const POP_LIKES = { path: 'likes', select: 'name email' };
const SERVER_ERR = { message: 'An error has occurred on the server.' };

// GET /items (public)
export const getItems = async (_req, res) => {
  try {
    const items = await ClothingItem.find({})
      .populate(POP_OWNER)
      .populate(POP_LIKES);
    return res.status(STATUS_OK).send(items);
  } catch (_err) {
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send(SERVER_ERR);
  }
};

// GET /items/:id
export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ClothingItem.findById(id)
      .populate(POP_OWNER)
      .populate(POP_LIKES);
    if (!item) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }
    return res.status(STATUS_OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send(SERVER_ERR);
  }
};

// POST /items
export const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;

    const doc = await ClothingItem.create({ name, weather, imageUrl, owner });
    await doc.populate([POP_OWNER, POP_LIKES]);
    return res.status(STATUS_CREATED).send(doc);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item data' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send(SERVER_ERR);
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

    if (String(item.owner) !== String(req.user?._id)) {
      return res
        .status(STATUS_FORBIDDEN)
        .send({ message: 'You can only delete your own items' });
    }

    await item.deleteOne();
    return res.status(STATUS_OK).send({ message: 'Item deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send(SERVER_ERR);
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
      { new: true },
    )
      .populate(POP_OWNER)
      .populate(POP_LIKES);

    if (!updated) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }
    return res.status(STATUS_OK).send(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send(SERVER_ERR);
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
      { new: true },
    )
      .populate(POP_OWNER)
      .populate(POP_LIKES);

    if (!updated) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
    }
    return res.status(STATUS_OK).send(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item id' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send(SERVER_ERR);
  }
};
