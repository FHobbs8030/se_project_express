import jwt from "jsonwebtoken";

const { JWT_SECRET = "dev-secret" } = process.env;

export default function auth(req, res, next) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = bearer || req.cookies?.jwt;
  if (!token) return res.status(401).send({ message: "Authorization required" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    next();
  } catch {
    res.status(401).send({ message: "Authorization required" });
  }
}
