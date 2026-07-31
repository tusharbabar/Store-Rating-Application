const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, authorizeRoles('STORE_OWNER'), getOwnerDashboard);

module.exports = router;
