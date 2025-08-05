import mongoose from 'mongoose';

const validateObjectId = (paramName) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).send({ message: `Invalid ${paramName}` });
  }
  return next();
};

export default validateObjectId;
