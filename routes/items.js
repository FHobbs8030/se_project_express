import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} from "../controllers/clothes.js";

const router = Router();

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

export default router;
