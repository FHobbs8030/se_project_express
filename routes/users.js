import { Router } from "express";
import { getMe, getUserById, updateProfile } from "../controllers/users.js";
import { validateUserIdParam, validateUpdateProfile } from "../utils/validators.js";

const router = Router();

router.get("/me", getMe);
router.get("/:userId", validateUserIdParam, getUserById);
router.patch("/me", validateUpdateProfile, updateProfile);

export default router;
