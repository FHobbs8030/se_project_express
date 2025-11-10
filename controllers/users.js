import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const cookieOpts = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export async function signup(req, res, next) {
  try {
    const { name, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });
    return res
      .status(201)
      .json({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
  } catch (e) {
    return next(e);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    res.cookie('jwt', token, cookieOpts());
    return res.json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (e) {
    return next(e);
  }
}

export async function getMe(req, res, next) {
  try {
    const me = await User.findById(req.user._id);
    if (!me) return res.status(404).json({ message: 'User not found' });
    return res.json({
      _id: me._id,
      name: me.name,
      avatar: me.avatar,
      email: me.email,
    });
  } catch (e) {
    return next(e);
  }
}

export async function signout(_req, res) {
  res.clearCookie('jwt', cookieOpts());
  return res.json({ message: 'Signed out' });
}
