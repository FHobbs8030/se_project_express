import Item from '../models/item.js';

export async function getItems(req, res, next) {
  try {
    const items = await Item.find({}).populate('owner', [
      '_id',
      'name',
      'email',
    ]);

    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;

    const item = await Item.create({ name, weather, imageUrl, owner });

    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (String(item.owner) !== String(req.user?._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await item.deleteOne();

    return res.json({ message: 'Item deleted', _id: itemId });
  } catch (err) {
    return next(err);
  }
}

export async function likeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    const updated = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function unlikeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    const updated = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}
