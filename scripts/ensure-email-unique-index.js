import mongoose from 'mongoose';
import User from '../models/user.js';

const { MONGO_URL = 'mongodb://localhost:27017/wtwr_db' } = process.env;

try {
  await mongoose.connect(MONGO_URL);
  await User.collection.createIndex({ email: 1 }, { unique: true });
  console.log('✅ users.email unique index ensured');
} catch (e) {
  console.error('❌ Failed to ensure unique index:', e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
