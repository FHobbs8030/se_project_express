import jwt from "jsonwebtoken";
const { JWT_SECRET = "dev_secret" } = process.env;

export default function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ message: "Authorization required" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
