import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'dev_secret' } = process.env;

export default function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    // 🔐 Check header exists and format is correct
    if (!authorization || !authorization.startsWith('Bearer ')) {
      const err = new Error('Authorization required');
      err.statusCode = 401;
      throw err;
    }

    // 🔑 Extract token
    const token = authorization.replace('Bearer ', '');

    // 🔍 Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // 📦 Attach user to request
    req.user = payload;

    return next();
  } catch (err) {
    err.statusCode = 401;
    return next(err);
  }
}
