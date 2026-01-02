import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, city } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      avatar: 'http://localhost:3001/images/users/avatar.png',
      city,
    });

    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send({ message: 'Incorrect email or password' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).send({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 604800000,
      })
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        city: user.city,
      });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: new Date(0),
    })
    .send({ message: 'Logged out' });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
};
