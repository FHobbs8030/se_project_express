import { Router } from "express";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import itemsRouter from "./items.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.use(authRouter);

router.use(auth);               
router.use("/users", usersRouter);
router.use("/items", itemsRouter);

export default router;
