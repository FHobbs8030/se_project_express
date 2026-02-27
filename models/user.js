import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../utils/errors/UnauthorizedError.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Invalid URL',
    },
  },
  city: {
    type: String,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then(user => {
      if (!user) {
        throw new UnauthorizedError('Incorrect email or password');
      }

      return bcrypt.compare(password, user.password).then(matched => {
        if (!matched) {
          throw new UnauthorizedError('Incorrect email or password');
        }

        return user;
      });
    });
};

export default mongoose.model('User', userSchema);
