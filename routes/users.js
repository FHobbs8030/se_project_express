import { Router } from "express";
import { getMe, updateMe } from "../controllers/users.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.use(auth);
router.get("/me", getMe);
router.patch("/me", updateMe);

export default router;
