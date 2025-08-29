import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_CREATED,
  STATUS_OK,
} from '../utils/constants.js';
import { JWT_SECRET } from '../utils/config.js';

// POST /signup
export const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !avatar || !email || !password) {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'All fields are required' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hash, // schema has select:false
    });

    const { _id } = user;
    return res.status(STATUS_CREATED).send({ _id, name, avatar, email });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(STATUS_CONFLICT).send({ message: 'Email already exists' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user data' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// POST /signin
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(STATUS_UNAUTHORIZED).send({ message: 'Incorrect email or password' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(STATUS_UNAUTHORIZED).send({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(STATUS_OK).send({ token });
  } catch (_err) {
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};
