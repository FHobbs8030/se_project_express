import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 30 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: { validator: validator.isEmail, message: "Invalid email" }
    },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
