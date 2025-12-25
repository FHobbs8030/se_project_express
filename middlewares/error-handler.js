export default function errorHandler(err, _req, res, _next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal Server Error' : message,
  });
}
