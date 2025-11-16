import User from "../models/user.js";

function httpError(status, message) {
  const e = new Error(message);
  e.statusCode = status;
  return e;
}

export async function getCurrentUser(req, res, next) {
  try {
    const id = req.user?._id;
    if (!id) throw httpError(401, "Unauthorized");
    const user = await User.findById(id);
    if (!user) throw httpError(404, "User not found");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw httpError(404, "User not found");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const id = req.user?._id;
    if (!id) throw httpError(401, "Unauthorized");
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { ...(name !== undefined ? { name } : {}), ...(avatar !== undefined ? { avatar } : {}) },
      { new: true, runValidators: true }
    );
    if (!user) throw httpError(404, "User not found");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
