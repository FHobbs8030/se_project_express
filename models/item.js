import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 30 },
    weather: { type: String, enum: ["hot", "warm", "cold"], required: true },
    imageUrl: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { versionKey: false }
);

export default mongoose.model("Item", itemSchema);
