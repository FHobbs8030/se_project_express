import mongoose from 'mongoose';

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
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, 'Invalid avatar URL'],
  },
});

export default mongoose.model('User', userSchema);
