const ClothingItem = require('../models/clothingItem'); // Adjust path if needed

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => res.status(500).send({ message: 'Server error' }));
};

module.exports.createClothingItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => res.status(400).send({ message: 'Bad request' }));
};

