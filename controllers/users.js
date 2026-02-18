import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

import BadRequestError from '../utils/errors/BadRequestError.js';
import ConflictError from '../utils/errors/ConflictError.js';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';
import NotFoundError from '../utils/errors/NotFoundError.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      avatar,
    });

    return res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('User already exists'));
    }

    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid user data'));
    }

    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Incorrect email or password'));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return next(new UnauthorizedError('Incorrect email or password'));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 604800000,
        path: '/',
      })
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
  } catch (err) {
    return next(err);
  }
};

export const logout = (_req, res) => {
  return res
    .cookie('jwt', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: new Date(0),
      path: '/',
    })
    .send({ message: 'Logged out' });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid user data'));
    }

    return next(err);
  }
};
