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
      validate: {
        validator: (v) => !v || validator.isEmail(v),
        message: 'Invalid email',
      },
    },
    // Hidden by default in queries
    password: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        const safe = { ...ret };

        delete safe.password;
        delete safe.email;

        const VKEY = '__v';
        if (Object.prototype.hasOwnProperty.call(safe, VKEY)) {
          delete safe[VKEY];
        }

        return safe;
      },
    },
  },
);

export default mongoose.model('User', userSchema);
