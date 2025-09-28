// db.js (ESM)
import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URL is missing");
  mongoose.set("strictQuery", true);
  mongoose.connection.on("connected", () => {
    console.log("[db] connected:", uri.replace(/\/\/.*@/, "//<creds>@"));
  });
  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err?.message || err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });
  await mongoose.connect(uri, { autoIndex: true });
}
