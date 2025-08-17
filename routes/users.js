import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { getUsers, getUser, createUser } from '../controllers/users.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/', getUsers);

router.get('/:userId', validateObjectId('userId'), getUser);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().required(),
    }),
  }),
  createUser,
);

export default router;
