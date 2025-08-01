const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', getUsers);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);
router.get('/:userId', getUserById);

module.exports = router;
