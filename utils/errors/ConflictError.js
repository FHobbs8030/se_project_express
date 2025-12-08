export default class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);
    this.statusCode = 409;
  }
}
