import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { signup, signin } from "../controllers/auth.js";

const router = Router();

const relativeOrHttpUrl = Joi.string().pattern(/^(https?:\/\/.+)|(\/[A-Za-z0-9._\-\/]+)$/);

router.post(
  "/signup",
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      avatar: relativeOrHttpUrl.optional()
    })
  }),
  signup
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    })
  }),
  signin
);

export default router;
