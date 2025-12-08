import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from '../utils/errors/index.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

const normalizeAvatar = filename => `/images/users/${filename}`;

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar, city } = req.body;

    const avatarPath = avatar ? normalizeAvatar(avatar) : null;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      avatar: avatarPath,
      city,
    });

    res.status(201).send({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
      _id: user._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('User already exists'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid user data'));
    } else {
      next(err);
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 3600000 * 24 * 7,
      })
      .send({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        city: user.city,
        _id: user._id,
      });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req, res, next) => {
  try {
    res
      .cookie('jwt', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(0),
      })
      .send({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
      _id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid user ID'));
    } else {
      next(err);
    }
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.city) updates.city = req.body.city;

    if (req.body.avatar) {
      updates.avatar = normalizeAvatar(req.body.avatar);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.send({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid user update data'));
    } else {
      next(err);
    }
  }
};
