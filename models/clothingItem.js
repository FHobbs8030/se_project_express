import mongoose from 'mongoose';
import validator from 'validator';

const clothingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    weather: {
      type: String,
      required: true,
      enum: ['hot', 'warm', 'cold'],
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v, { require_protocol: true }),
        message: 'imageUrl must be a valid URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    // required ObjectId[] referencing user; default [] keeps it present
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      default: [],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { versionKey: false },
);

export default mongoose.model('clothingItem', clothingItemSchema);
