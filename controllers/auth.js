﻿import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function signup(req, res, next) {
  try {
    const { name, email, password, avatar } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      const e = new Error("User already exists");
      e.statusCode = 409;
      throw e;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, avatar });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const e = new Error("Incorrect email or password");
      e.statusCode = 401;
      throw e;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const e = new Error("Incorrect email or password");
      e.statusCode = 401;
      throw e;
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res
      .cookie("jwt", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ token });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
}
