const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
