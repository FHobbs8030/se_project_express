// models/item.js
import mongoose from "mongoose";

const urlRegex = /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w\-./?%&=]*)?$/i;

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    weather: { type: String, enum: ["hot", "warm", "cold"], required: true },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v) => urlRegex.test(v),
        message: "imageUrl must be a valid URL",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,            // ensure only signed-in owners can create
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],               // enable like/unlike endpoints
    },
  },
  { timestamps: true }           // adds createdAt / updatedAt
);

// optional: nicer JSON (hide __v)
itemSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Item", itemSchema);
