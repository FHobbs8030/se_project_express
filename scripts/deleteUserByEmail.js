import "dotenv/config";
import mongoose from "mongoose";

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr" } = process.env;

const userSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  email: { type: String, unique: true, required: true },
  password: String
});
const User = mongoose.model("user", userSchema);

async function run() {
  const [, , email] = process.argv;
  if (!email) {
    console.error("Usage: node scripts/deleteUserByEmail.js <email>");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URL);
  const res = await User.deleteOne({ email });
  console.log(JSON.stringify(res));
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
