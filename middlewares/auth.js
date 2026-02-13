import jwt from 'jsonwebtoken';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export default function auth(req, _res, next) {
  const { jwt: token } = req.cookies;

  if (!token) {
    return next(new UnauthorizedError('Authorization required'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }
}
