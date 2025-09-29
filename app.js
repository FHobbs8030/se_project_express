import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import itemsRouter from "./routes/items.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import auth from "./middleware/auth.js";

const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin === "*" ? "*" : allowedOrigin.split(",").map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json());

app.use(authRouter);
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/items", itemsRouter);

app.use(auth);
app.use("/users", usersRouter);

app.use((req, res) => res.status(404).json({ message: "Not Found" }));

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const PORT = Number(process.env.PORT || 3001);
const MONGO = process.env.MONGO_URL;

async function start() {
  console.log("[env] PORT=%s NODE_ENV=%s", PORT, process.env.NODE_ENV);
  console.log("[env] MONGO_URL=%s", (MONGO || "").replace(/\/\/.*@/, "//<creds>@"));
  await connectDB(MONGO);
  app.listen(PORT, () => {
    console.log("[server] listening http://localhost:%d", PORT);
  });
}

process.on("unhandledRejection", (r) => console.error("[unhandledRejection]", r));
process.on("uncaughtException", (e) => console.error("[uncaughtException]", e));

start();

export default app;
