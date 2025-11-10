import "dotenv/config";
import mongoose from "mongoose";

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr" } = process.env;

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  weather: { type: String, enum: ["hot", "warm", "cold"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
});
const Item = mongoose.model("item", itemSchema);

async function run() {
  await mongoose.connect(MONGO_URL);
  await Item.deleteMany({});
  await Item.insertMany([
    { name: "T-shirt", imageUrl: "https://images.unsplash.com/photo-1602810318383-8b38a9d05f2b", weather: "warm" },
    { name: "Jacket",  imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543", weather: "cold" },
    { name: "Boots",   imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552", weather: "cold" }
  ]);
  console.log("Seed complete");
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
