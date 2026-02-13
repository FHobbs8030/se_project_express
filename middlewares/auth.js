import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'dev-secret' } = process.env;

export default function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Authorization required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).send({ message: 'Authorization required' });
  }
}
