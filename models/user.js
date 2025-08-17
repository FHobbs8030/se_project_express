// models/user.js
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
    // Optional for this sprint; kept for seeded data compatibility
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
    versionKey: false, // don’t include __v going forward
    toJSON: {
      transform(_doc, ret) {
        // return a sanitized copy (no param reassign, eslint-safe)
        const safe = { ...ret };

        // strip sensitive fields
        delete safe.password;
        delete safe.email;

        // strip legacy version key without violating lint rules
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
