import mongoose from 'mongoose';
import { STATUS_BAD_REQUEST } from '../utils/constants.js';

const validateObjectId = paramName => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res
      .status(STATUS_BAD_REQUEST)
      .send({ message: `Invalid ${paramName}` });
  }
  return next();
};

export default validateObjectId;
