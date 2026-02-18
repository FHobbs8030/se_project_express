import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const { jwt: token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Authorization required' });
  }
}
