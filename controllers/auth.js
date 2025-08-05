import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export const createUser = async (req, res, next) => {
  const {
    name, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, avatar, email, password: hash,
    });
    return res.status(201).send({
      name: user.name, avatar: user.avatar, email: user.email, _id: user._id,
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};
