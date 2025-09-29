// controllers/users.js
import User from "../models/user.js";

/**
 * GET /users/me
 * Requires auth middleware to set req.user._id
 */
export async function getMe(req, res, next) {
  try {
    const userId = req.user?._id;
    const me = await User.findById(userId).select("-password");
    if (!me) return res.status(404).json({ message: "User not found" });
    res.json(me);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/:userId
 */
export async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me
 * Body: { name, avatar? }
 */
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user?._id;
    const { name, avatar } = req.body;

    const update = { name };
    if (typeof avatar === "string") update.avatar = avatar;

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
