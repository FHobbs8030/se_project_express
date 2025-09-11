import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 30, trim: true },
    weather: { type: String, required: true, enum: ['hot', 'warm', 'cold'] },
    imageUrl: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', select: false }],
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('Item', itemSchema);
