// controllers/users.js
import User from '../models/user.js';

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    return res.send(user);
  } catch (e) {
    return next(e);
  }
}
