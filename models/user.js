const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
} = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');

router.get('/', getUsers);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);
router.get('/:userId', getUserById);

module.exports = router;
