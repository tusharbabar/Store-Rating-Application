const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', authenticateToken, updatePassword);

module.exports = router;
