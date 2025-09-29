import jwt from "jsonwebtoken";

const { JWT_SECRET = "dev-super-secret-change-me" } = process.env;

export default function auth(req, res, next) {
  const { authorization = "" } = req.headers;
  const parts = authorization.split(" ");
  const isBearer = parts.length === 2 && parts[0] === "Bearer";
  if (!isBearer) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Authorization required" });
  }
}
