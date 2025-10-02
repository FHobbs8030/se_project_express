import jwt from "jsonwebtoken";
const { JWT_SECRET = "dev_secret" } = process.env;

export default function auth(req, res, next) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.jwt || bearer;

  if (!token) return res.status(401).json({ message: "Authorization required" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
