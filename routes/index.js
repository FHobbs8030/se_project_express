import { Router } from "express";
import { signup, signin, signout } from "../controllers/auth.js";
import itemsRouter from "./items.js";
import usersRouter from "./users.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.use("/items", itemsRouter);
router.use("/users", usersRouter);

router.post("/signout", signout);

export default router;
