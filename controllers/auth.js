import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const { JWT_SECRET = 'dev_secret' } = process.env;

export async function signup(req, res, next) {
  try {
    const { name, email, password, avatar } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      const e = new Error('User already exists');
      e.statusCode = 409;
      throw e;
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
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
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const e = new Error('Incorrect email or password');
      e.statusCode = 401;
      throw e;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const e = new Error('Incorrect email or password');
      e.statusCode = 401;
      throw e;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })
      .status(200)
      .json({ token });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    return next(err);
  }
}

export async function signout(req, res, next) {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
