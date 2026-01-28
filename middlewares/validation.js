import { celebrate, Joi } from 'celebrate';
import validator from 'validator';

const validateAbsoluteURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateImagePath = (value, helpers) => {
  if (/^\/images\/.+\.(png|jpg|jpeg|webp|svg)$/.test(value)) {
    return value;
  }
  return helpers.error('string.pattern.base');
};

export const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().custom(validateImagePath),
    weather: Joi.string().required().valid('hot', 'warm', 'cold'),
  }),
});

export const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom(validateAbsoluteURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required().custom(validateAbsoluteURL),
  }),
});

export const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

export const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});
