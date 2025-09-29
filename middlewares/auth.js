import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
    const cookieToken = req.cookies?.jwt || null;
    const token = bearer || cookieToken;
    if (!token) {
      const e = new Error("Authorization required");
      e.statusCode = 401;
      throw e;
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload._id };
    next();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
}
