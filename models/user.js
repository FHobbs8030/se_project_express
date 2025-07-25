const mongoose = require('mongoose');
const validator = require('validator'); 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Invalid URL format for avatar',
    },
  },
});

module.exports = mongoose.model('User', userSchema);
