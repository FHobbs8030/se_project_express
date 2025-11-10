import { Router } from "express";
import users from "./users.js";
import items from "./items.js";

const router = Router();

router.use(users);
router.use(items);

export default router;