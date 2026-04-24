import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const { JWT_SECRET = 'dev_secret' } = process.env;

// SIGNUP
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error('User already exists');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    return next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const err = new Error('Incorrect email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Incorrect email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ token });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    return next(err);
  }
};

// LOGOUT
export const logout = async (req, res, next) => {
  try {
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    );

    return res.send(user);
  } catch (err) {
    return next(err);
  }
};
