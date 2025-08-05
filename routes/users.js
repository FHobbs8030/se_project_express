const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
} = require('../controllers/users.js');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/:userId', updateUser);

module.exports = router;
