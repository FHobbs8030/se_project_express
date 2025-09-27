// controllers/auth.js (ESM)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash }); // ensure password has select:false in model
    return res.status(201).send({ _id: user._id, name: user.name, email: user.email });
  } catch (e) {
    // duplicate email => 11000
    if (e?.code === 11000) return res.status(409).send({ message: 'Email already in use' });
    return next(e);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).send({ message: 'Incorrect email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send({ message: 'Incorrect email or password' });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // cookie-based auth to match what you’ve been using
    const isProd = process.env.NODE_ENV === 'production';
    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({ message: 'ok' });
  } catch (e) {
    return next(e);
  }
}
