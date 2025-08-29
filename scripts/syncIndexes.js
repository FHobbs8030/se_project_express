import mongoose from 'mongoose';
import User from '../models/user.js';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/wtwr_db';

(async () => {
  await mongoose.connect(MONGO_URL);
  console.log('Before:', await User.collection.indexes());
  // Drops indexes not in the schema and ensures those that are
  const res = await User.syncIndexes();
  console.log('syncIndexes result:', res);
  console.log('After:', await User.collection.indexes());
  await mongoose.disconnect();
})();
