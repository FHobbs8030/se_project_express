// controllers/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).send({ message: 'Incorrect email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send({ message: 'Incorrect email or password' });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // send token in JSON (frontend will put it in Authorization header)
    return res.status(200).send({ token });
  } catch (e) { next(e); }
}
