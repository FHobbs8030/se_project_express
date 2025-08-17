export default function hardcodedUser(req, _res, next) {
  if (!req.user) {
    Object.defineProperty(req, 'user', {
      value: { _id: '000000000000000000000001' },
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  next();
}
