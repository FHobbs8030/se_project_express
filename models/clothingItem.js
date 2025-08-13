import mongoose from 'mongoose';
import validator from 'validator';

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
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
      message: 'Invalid URL format',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // ✅ required
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [], // ✅ default on the field (not per-array element)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ClothingItem', clothingItemSchema);
