import User from '../models/user.js';

export async function getMe(req, res, next) {
  try {
    const me = await User.findById(req.user._id);
    if (!me) return res.status(404).send({ message: 'User not found' });
    return res.send(me);
  } catch (e) {
    return next(e);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { name, avatar } = req.body;
    const update = {
      ...(name != null ? { name } : {}),
      ...(avatar != null ? { avatar } : {}),
    };

    const updated = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).send({ message: 'User not found' });
    return res.send(updated);
  } catch (e) {
    return next(e);
  }
}
