import { celebrate, Joi, Segments } from 'celebrate';
import express from 'express';
import auth from '../middlewares/auth.js';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
} from '../controllers/users.js';

const router = express.Router();

// Validation Schemas
const userIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const userBodyValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const userUpdateValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }).min(1),
});

// Routes
router.get('/', auth, getUsers);
router.get('/:userId', auth, userIdValidation, getUserById);
router.post('/', userBodyValidation, createUser);
router.patch('/:userId', auth, userIdValidation, userUpdateValidation, updateUser);

export default router;
