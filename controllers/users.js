import User from '../models/user.js';
import {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} from '../utils/constants.js';

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find({}).select('name avatar createdAt');
    return res.status(STATUS_OK).send(users);
  } catch {
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Failed to fetch users' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name avatar createdAt');
    if (!user) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user id' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.create({ name, avatar });
    return res.status(STATUS_CREATED).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user data' });
    }
    return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Failed to create user' });
  }
};
