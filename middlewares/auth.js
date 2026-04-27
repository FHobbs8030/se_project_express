import jwt from 'jsonwebtoken';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';

const { JWT_SECRET = 'dev-secret' } = process.env;

export default function auth(req, _res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Authorization required'));
    }

    const token = authorization.replace('Bearer ', '');

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }
}
