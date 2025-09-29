import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 2, maxlength: 30, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
