import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const { JWT_SECRET = "dev-secret", NODE_ENV } = process.env;

export async function signup(req, res, next) {
  try {
    const { name, email, password, avatar = "" } = req.body;
    const hash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email, password: hash, avatar });
    res.status(201).send({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (err) {
    if (err.code === 11000) return res.status(409).send({ message: "User already exists" });
    next(err);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
    if (!user) return res.status(401).send({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) return res.status(401).send({ message: "Invalid email or password" });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .send({ message: "ok" });
  } catch (err) {
    next(err);
  }
}

export async function signout(_req, res) {
  res.clearCookie("jwt", { path: "/" }).send({ message: "signed out" });
}
