import { Router } from "express";
import { getItems, createItem, deleteItem } from "../controllers/items.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:id", auth, deleteItem);

export default router;
