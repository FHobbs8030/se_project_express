import User from "../models/user.js";

export async function getMe(req, res, next) {
  try {
    const me = await User.findById(req.user._id).lean();
    if (!me) return res.status(404).send({ message: "User not found" });
    res.send({ _id: me._id, name: me.name, email: me.email, avatar: me.avatar });
  } catch (e) { next(e); }
}

export async function updateMe(req, res, next) {
  try {
    const { name, avatar } = req.body;
    const update = {};
    if (name != null) update.name = name;
    if (avatar != null) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).lean();
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (e) { next(e); }
}
