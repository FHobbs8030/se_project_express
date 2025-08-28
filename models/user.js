import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) =>
          validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'Invalid avatar URL',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('user', userSchema);
