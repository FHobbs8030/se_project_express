import Item from "../models/item.js";

export async function getItems(req, res, next) {
  try {
    const items = await Item.find().lean();
    res.status(200).send(items);
  } catch (e) { next(e); }
}

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id || null;
    const item = await Item.create({ name, weather, imageUrl, owner });
    res.status(201).send(item);
  } catch (e) { next(e); }
}

export async function deleteItem(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Item not found" });
    res.send({ message: "Deleted", id });
  } catch (e) { next(e); }
}
