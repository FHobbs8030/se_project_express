// Middleware to simulate an authenticated user for Sprint 12
// Sets req.user to a fixed, valid MongoDB ObjectId string.
export default function hardcodedUser(_req, res, next) {
  // Use a stable 24-hex string as a fake user id
  // Feel free to change it, but keep it 24 hex chars.
  _req.user = { _id: '000000000000000000000001' };
  next();
}
