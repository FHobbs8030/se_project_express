import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import auth from "../middleware/auth.js";
import {
  getItems,
  createItem,
  likeItem,
  unlikeItem,
  deleteItem,
} from "../controllers/items.js";

const router = Router();

const validateItemId = celebrate({
  [Segments.PARAMS]: {
    itemId: Joi.string().hex().length(24).required(),
  },
});

const validateCreateItem = celebrate({
  [Segments.BODY]: {
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().uri().required(),
  },
});

router.get("/items", auth, getItems);
router.post("/items", auth, validateCreateItem, createItem);
router.put("/items/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/items/:itemId/likes", auth, validateItemId, unlikeItem);
router.delete("/items/:itemId", auth, validateItemId, deleteItem);

export default router;