import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { createItem } from "../controllers/items.js";

const router = Router();

router.post(
  "/",
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      weather: Joi.string().valid("hot", "warm", "cold").required(),
      imageUrl: Joi.string().required()
    })
  }),
  createItem
);

export default router;
