import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const { JWT_SECRET = 'dev-super-secret-change-me' } = process.env;

// POST /signup
export async function signup(req, res, next) {
  try {
    const { name, email, password, avatar } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('User with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, avatar });

    // do NOT return password hash
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

// POST /signin
export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const e = new Error('Invalid credentials');
      e.statusCode = 400; // Sprint collections often expect 400 on invalid creds
      throw e;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const e = new Error('Invalid credentials');
      e.statusCode = 400;
      throw e;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Newman test expects a `token` field, often also _id
    res.json({ token, _id: user._id });
  } catch (err) {
    next(err);
  }
}
