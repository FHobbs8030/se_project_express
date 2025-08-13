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
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            protocols: ['http', 'https'],
          });
        },
        message: 'Invalid URL for avatar',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Invalid email address',
      },
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
