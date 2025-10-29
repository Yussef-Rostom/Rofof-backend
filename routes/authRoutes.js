const express = require('express');

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
} = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validation');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;