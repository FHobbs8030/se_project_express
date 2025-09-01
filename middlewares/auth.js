// middlewares/auth.js
import jwt from 'jsonwebtoken';
import { STATUS_UNAUTHORIZED } from '../utils/constants.js';
import JWT_SECRET from '../utils/jwt.js'; // <-- fix: ../utils/...

export default function auth(req, res, next) {
  const { authorization = '' } = req.headers;

  // Expect: Authorization: Bearer <token>
  const [scheme, token] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Authorization required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET); // { _id: ... }
    req.user = payload;
    return next();
  } catch (_err) {
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Invalid or expired token' });
  }
}
