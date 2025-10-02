import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import { connectDB } from "./utils/db.js";
import authRouter from "./routes/auth.js";
import itemsRouter from "./routes/items.js";
import usersRouter from "./routes/users.js";
import auth from "./middlewares/auth.js";

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(s => s.trim())
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use(authRouter);
app.use(auth);
app.use("/items", itemsRouter);
app.use("/users", usersRouter);

app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use(errors());
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const port = process.env.PORT || 3001;
connectDB().then(() => app.listen(port, () => console.log(`API listening on ${port}`)));
