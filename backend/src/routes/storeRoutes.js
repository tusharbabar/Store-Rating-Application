const express = require('express');
const router = express.Router();
const { getAllStores } = require('../controllers/storeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllStores);

module.exports = router;
