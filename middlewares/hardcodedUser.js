export default function hardcodedUser(req, res, next) {
  Object.defineProperty(req, 'user', {
    value: { _id: '000000000000000000000001' },
    writable: true,
    enumerable: true,
    configurable: true,
  });
  if (typeof res === 'undefined') {
    return next();
  }
  return next();
}

