import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const token = req.cookies?.jwt;
    if (!token)
      return res.status(401).json({ message: 'Authorization required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = { _id: payload._id };
    next();
  } catch {
    res.status(401).json({ message: 'Authorization required' });
  }
}
