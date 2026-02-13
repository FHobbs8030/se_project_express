import Item from '../models/item.js';
import NotFoundError from '../utils/errors/NotFoundError.js';
import ForbiddenError from '../utils/errors/ForbiddenError.js';
import BadRequestError from '../utils/errors/BadRequestError.js';

export async function getItems(req, res, next) {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;

    const item = await Item.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    return res.status(201).json(item);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid item data'));
    }

    return next(err);
  }
}

export async function likeItem(req, res, next) {
  try {
    const { itemId } = req.params;

    const updated = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!updated) {
      return next(new NotFoundError('Item not found'));
    }

    return res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }

    return next(err);
  }
}

export async function unlikeItem(req, res, next) {
  try {
    const { itemId } = req.params;

    const updated = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!updated) {
      return next(new NotFoundError('Item not found'));
    }

    return res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }

    return next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    if (String(item.owner) !== String(req.user._id)) {
      return next(new ForbiddenError('Forbidden'));
    }

    await item.deleteOne();

    return res.json({ message: 'Deleted', _id: itemId });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID'));
    }

    return next(err);
  }
}
