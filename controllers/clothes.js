import Item from "../models/item.js";

export async function getItems(req, res, next) {
  try {
    const items = await Item.find({}).populate("owner", ["_id", "name", "email"]);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;
    const item = await Item.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.owner) !== String(req.user?._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await item.deleteOne();
    res.json({ message: "Item deleted", _id: itemId });
  } catch (err) {
    next(err);
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
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    next(err);
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
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
