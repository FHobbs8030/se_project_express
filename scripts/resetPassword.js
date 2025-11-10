import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr" } = process.env;

const userSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  email: { type: String, unique: true, required: true },
  password: String
});
const User = mongoose.model("user", userSchema);

async function run() {
  const [, , email, newPassword] = process.argv;
  if (!email || !newPassword) {
    console.error("Usage: node scripts/resetPassword.js <email> <newPassword>");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URL);
  const hash = await bcrypt.hash(newPassword, 10);
  const user = await User.findOneAndUpdate({ email }, { password: hash }, { new: true });
  console.log(user ? `OK ${user.email}` : "not found");
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
