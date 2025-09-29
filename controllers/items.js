import Item from "../models/item.js";

export async function createItem(req, res, next) {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user?._id;
    if (!owner) {
      const e = new Error("Unauthorized");
      e.statusCode = 401;
      throw e;
    }
    const doc = await Item.create({ name, weather, imageUrl, owner });
    res.status(201).json(doc);
  } catch (err) {
    if (err.name === "ValidationError") err.statusCode = 400;
    next(err);
  }
}
