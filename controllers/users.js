import User from "../models/user.js";

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const update = { name: req.body.name };
    if (typeof req.body.avatar === "string") update.avatar = req.body.avatar;
    const user = await User.findByIdAndUpdate(req.user?._id, update, {
      new: true,
      runValidators: true,
      select: "-password",
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}
