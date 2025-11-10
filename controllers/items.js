import Item from "../models/item.js";

export async function getItems(req, res, next) {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const item = await Item.create({ name, weather, imageUrl, owner: req.user._id });
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function likeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const updated = await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function unlikeItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const updated = await Item.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }
    await item.deleteOne();
    res.json({ message: "Deleted", _id: itemId });
  } catch (e) { next(e); }
}