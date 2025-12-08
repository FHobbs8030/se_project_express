import { celebrate, Joi, Segments } from 'celebrate';

const allowedExtensions = /\.(png|jpg|jpeg|webp)$/i;

const filenameValidator = Joi.string()
  .regex(/^[a-zA-Z0-9._-]+$/)
  .regex(allowedExtensions)
  .message('Invalid filename format');

export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    city: Joi.string().min(2).max(50).allow('', null),
    avatar: filenameValidator.allow(null, ''),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    city: Joi.string().min(2).max(50).allow('', null).optional(),
    avatar: filenameValidator.optional(),
  }),
});

export const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
    imageUrl: filenameValidator.required(),
  }),
});

export const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});
