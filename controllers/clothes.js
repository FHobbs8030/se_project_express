const ClothingItem = require('../models/clothingItem');
const mongoose = require('mongoose');
const {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NOT_FOUND,
} = require('../utils/constants');

module.exports.deleteClothingItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID' });
  }

  ClothingItem.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(STATUS_OK).send({ message: 'Item deleted successfully' });
    })
    .catch(() =>
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Server error while deleting item',
      })
    );
};
