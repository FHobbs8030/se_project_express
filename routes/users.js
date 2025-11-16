import { Router } from "express";
import { getCurrentUser, getUserById, updateProfile } from "../controllers/users.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = Router();

router.get("/me", getCurrentUser);
router.get("/:userId", validateObjectId, getUserById);
router.patch("/me", updateProfile);

export default router;
