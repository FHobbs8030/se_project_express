import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 2, maxlength: 30, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false },
);

// name the hook function for func-names; always return for consistent-return
userSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.statics.findByCredentials = async function findByCredentials(email, password) {
  const user = await this.findOne({ email: String(email || '').toLowerCase() }).select('+password');
  if (!user) throw Object.assign(new Error('Incorrect email or password'), { statusCode: 401 });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw Object.assign(new Error('Incorrect email or password'), { statusCode: 401 });
  return user;
};

// avoid param reassign; return new object
userSchema.set('toJSON', {
  transform(_doc, ret) {
    const { password, ...rest } = ret;
    return rest;
  },
});

export default mongoose.model('User', userSchema);
