// routes/items.js
import { Router } from "express";
import {
  getItems, createItem, deleteItem, likeItem, unlikeItem
} from "../controllers/items.js";
import { validateCreateItem, validateItemIdParam } from "../utils/validators.js";

const router = Router();

router.get("/", getItems);
router.post("/", validateCreateItem, createItem);
router.delete("/:itemId", validateItemIdParam, deleteItem);
router.put("/:itemId/likes", validateItemIdParam, likeItem);
router.delete("/:itemId/likes", validateItemIdParam, unlikeItem);

export default router;
