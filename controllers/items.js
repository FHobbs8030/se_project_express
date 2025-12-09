import Item from '../models/item.js';
import BadRequestError from '../utils/errors/BadRequestError.js';
import NotFoundError from '../utils/errors/NotFoundError.js';
import ForbiddenError from '../utils/errors/ForbiddenError.js';

export const getItems = async (_req, res, next) => {
  try {
    const items = await Item.find({});
    res.send(items);
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;

    const item = await Item.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    res.status(201).send(item);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid item data'));
    } else {
      next(err);
    }
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (item.owner.toString() !== req.user._id) {
      throw new ForbiddenError('You cannot delete items you do not own');
    }

    await item.deleteOne();
    res.send({ message: 'Item deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid item ID'));
    } else {
      next(err);
    }
  }
};

export const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndUpdate(itemId, { $addToSet: { likes: req.user._id } }, { new: true });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid item ID'));
    } else {
      next(err);
    }
  }
};

export const unlikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndUpdate(itemId, { $pull: { likes: req.user._id } }, { new: true });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    res.send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid item ID'));
    } else {
      next(err);
    }
  }
};
