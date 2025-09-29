import "dotenv/config";
import express from "express";
import cors from "cors";
import { errors as celebrateErrors } from "celebrate";
import { connectDB } from "./utils/db.js";
import itemsRouter from "./routes/items.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import auth from "./middleware/auth.js";

const app = express();

connectDB();

const allowedOrigin = process.env.CLIENT_ORIGIN || "*";
app.use(
  cors({
    origin:
      allowedOrigin === "*"
        ? "*"
        : allowedOrigin.split(",").map((s) => s.trim()),
    credentials: true,
  })
);

app.use(express.json());

app.use("/items", itemsRouter);
app.use(authRouter);
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(auth);
app.use("/users", usersRouter);

app.use((req, res) => res.status(404).json({ message: "Not Found" }));

app.use(celebrateErrors());

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

export default app;
