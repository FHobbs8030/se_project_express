// controllers/items.js
import Item from "../models/item.js";

export async function getItems(req, res, next) {
  try {
    const docs = await Item.find({}).populate("owner", "name email").lean();
    res.json(docs);
  } catch (err) { next(err); }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;
    if (!owner) { const e = new Error("Unauthorized"); e.statusCode = 401; throw e; }
    const doc = await Item.create({ name, weather, imageUrl, owner });
    res.status(201).json(doc);
  } catch (err) {
    if (err.name === "ValidationError") err.statusCode = 400;
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.owner) !== String(req.user?._id)) {
      const e = new Error("Forbidden"); e.statusCode = 403; throw e;
    }
    await item.deleteOne();
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function likeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const doc = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Item not found" });
    res.json(doc);
  } catch (err) { next(err); }
}

export async function unlikeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const doc = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Item not found" });
    res.json(doc);
  } catch (err) { next(err); }
}
