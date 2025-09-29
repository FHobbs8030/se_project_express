import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 30 },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export default mongoose.model("User", userSchema);
