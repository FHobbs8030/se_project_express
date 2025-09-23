import Item from '../models/item.js';

export async function getItems(_req, res, next) {
  try {
    // expose owner so the frontend can filter by currentUser._id
    const items = await Item.find({}).select('+owner').lean();
    return res.send(items);
  } catch (e) {
    return next(e);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    const doc = await Item.create({ name, weather, imageUrl, owner });
    return res.status(201).send(doc);
  } catch (e) {
    return next(e);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId).select('+owner');
    if (!item) return res.status(404).send({ message: 'Item not found' });
    if (String(item.owner) !== String(req.user._id)) {
      return res.status(403).send({ message: 'Forbidden: not the owner' });
    }
    await item.deleteOne();
    return res.send({ message: 'Item deleted' });
  } catch (e) {
    return next(e);
  }
}

// remove the duplicate listItems OR export an alias if the route expects it:
// export const listItems = getItems;
