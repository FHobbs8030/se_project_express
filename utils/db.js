import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error("MONGO_URL is missing");

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB connected");
}
