import User from '../models/user.js';
import {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK,
} from '../utils/constants.js';

// GET /users/me
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err?.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user id' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};

// PATCH /users/me
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Only set fields that were actually provided (avoid overwriting with undefined)
    const update = {};
    if (typeof name !== 'undefined') update.name = name;
    if (typeof avatar !== 'undefined') update.avatar = avatar;

    if (Object.keys(update).length === 0) {
      return res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'At least one field (name or avatar) must be provided' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updated) {
      return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
    }

    return res.status(STATUS_OK).send(updated);
  } catch (err) {
    if (err?.name === 'ValidationError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid profile data' });
    }
    if (err?.name === 'CastError') {
      return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user id' });
    }
    return res
      .status(STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server.' });
  }
};
