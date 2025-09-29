import { Router } from "express";
import { signup, signin } from "../controllers/auth.js";
import { validateSignup, validateSignin } from "../utils/validators.js";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signin);

export default router;
