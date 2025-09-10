import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function signup(req, res, next) {
  try {
    const { name, email, password, avatar } = req.body;
    const u = await User.create({ name, email, password, avatar });
    const { _id, createdAt, updatedAt } = u.toObject();

    return res
      .status(201)
      .send({ _id, name: u.name, email: u.email, avatar: u.avatar, createdAt, updatedAt });
  } catch (e) {
    if (e.code === 11000) {
      e.statusCode = 409;
      e.message = 'Email already exists';
    }
    return next(e);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '7d',
    });
    return res.send({ token });
  } catch (e) {
    e.statusCode = e.statusCode || 401;
    return next(e);
  }
}
