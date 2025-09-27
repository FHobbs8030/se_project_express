// controllers/items.js
import { Types } from 'mongoose';
import Item from '../models/item.js';

export async function listItems(req, res, next) {
  try {
    const docs = await Item.find({}).populate('owner', '_id name email');
    res.send(docs);
  } catch (e) { next(e); }
}

export async function createItem(req, res, next) {
  try {
    const { name, imageUrl, weather } = req.body;
    const doc = await Item.create({ name, imageUrl, weather, owner: req.user._id });
    res.status(201).send(doc);
  } catch (e) { next(e); }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    if (!Types.ObjectId.isValid(itemId)) {
      return res.status(400).send({ message: 'Invalid itemId' });
    }
    const doc = await Item.findById(itemId);
    if (!doc) return res.status(404).send({ message: 'Item not found' });
    if (String(doc.owner) !== String(req.user._id)) {
      return res.status(403).send({ message: 'Forbidden: not the owner' });
    }
    await doc.deleteOne();
    res.send({ message: 'Deleted', id: itemId });
  } catch (e) { next(e); }
}

// --- Optional if likes are required by your rubric ---
export async function likeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    if (!Types.ObjectId.isValid(itemId)) {
      return res.status(400).send({ message: 'Invalid itemId' });
    }
    const doc = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!doc) return res.status(404).send({ message: 'Item not found' });
    res.send(doc);
  } catch (e) { next(e); }
}

export async function unlikeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    if (!Types.ObjectId.isValid(itemId)) {
      return res.status(400).send({ message: 'Invalid itemId' });
    }
    const doc = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!doc) return res.status(404).send({ message: 'Item not found' });
    res.send(doc);
  } catch (e) { next(e); }
}
