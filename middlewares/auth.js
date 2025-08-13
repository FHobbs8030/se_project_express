import jwt from 'jsonwebtoken';
import { STATUS_UNAUTHORIZED } from '../utils/constants.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Authorization required' });
  }

  const token = authorization.slice(7); // remove "Bearer "

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (_err) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .send({ message: 'Invalid token' });
  }

  return next();
};

export default auth;
