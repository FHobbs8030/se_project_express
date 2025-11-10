import { celebrate, Joi } from "celebrate";
const objectId = () => Joi.string().hex().length(24).required();

const relativeOrHttpUrl = Joi.string()
  .pattern(/^(?:https?:\/\/.+|\/[A-Za-z0-9._\-\/]+)$/)
  .required();

export const validateSignup = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().uri().optional(),
  }).unknown(false),
});

export const validateSignin = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
});

export const validateUserIdParam = celebrate({
  params: Joi.object({
    userId: objectId(),
  }).unknown(false),
});

export const validateUpdateProfile = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().optional(),
  }).unknown(false),
});

export const validateCreateItem = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: relativeOrHttpUrl,
  }).unknown(false),
});

export const validateItemIdParam = celebrate({
  params: Joi.object({
    itemId: objectId(),
  }).unknown(false),
});
