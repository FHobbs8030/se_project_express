import { Router } from "express";
import { validateCreateItem, validateItemIdParam } from "../utils/validators.js";
import { getItems, createItem, deleteItem, likeItem, unlikeItem } from "../controllers/clothes.js";

const router = Router();

router.get("/", getItems);
router.post("/", validateCreateItem, createItem);
router.delete("/:itemId", validateItemIdParam, deleteItem);
router.put("/:itemId/likes", validateItemIdParam, likeItem);
router.delete("/:itemId/likes", validateItemIdParam, unlikeItem);

export default router;
