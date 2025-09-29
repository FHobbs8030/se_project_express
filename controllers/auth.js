import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const { JWT_SECRET = "dev_secret", JWT_EXPIRES_IN = "7d" } = process.env;

export async function signup(req, res, next) {
  try {
    const { name, email, password, avatar } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      ...(avatar ? { avatar } : {}),
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: "Email already registered" });
    next(err);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}
