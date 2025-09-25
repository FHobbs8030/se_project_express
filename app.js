import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcryptjs";

import router from "./routes/index.js";
import User from "./models/user.js";

dotenv.config();

const {
  PORT = 3001,
  MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db",
} = process.env;

const app = express();

const ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors({ origin: ALLOWED_ORIGINS, credentials: true }));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

process.on("uncaughtException", (e) => console.error("[uncaughtException]", e));
process.on("unhandledRejection", (e) => console.error("[unhandledRejection]", e));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/health", (req, res) => res.send({ status: "ok" }));

app.get("/_debug/check", async (req, res) => {
  try {
    const email = String(req.query.email || "").toLowerCase().trim();
    const password = String(req.query.password || "");
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.send({ found: false });
    const ok = await bcrypt.compare(password, user.password);
    res.send({ found: true, compareOK: ok, hashPrefix: user.password?.slice(0, 4) });
  } catch (e) {
    res.status(500).send({ error: String(e) });
  }
});

app.use(
  "/images/clothes",
  express.static(path.join(__dirname, "public", "images", "clothes"))
);

app.use("/", router);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = status === 500 ? "Server error" : err.message;
  res.status(status).send({ message });
});

const server = app.listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`);
  console.log("[server] connecting to Mongo:", MONGO_URL);
});

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("[server] Mongo connected"))
  .catch((err) => console.error("[server] Mongo connection error:", err.message));

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
