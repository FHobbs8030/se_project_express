import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v, { require_protocol: true }),
        message: 'avatar must be a valid URL',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true, // <-- keep this
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'email must be valid',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { versionKey: false },
);

// ❌ remove any extra: userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('user', userSchema);
