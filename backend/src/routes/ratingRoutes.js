const express = require('express');
const router = express.Router();
const { submitOrUpdateRating } = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/stores/:id/rating', authenticateToken, authorizeRoles('USER', 'NORMAL_USER'), submitOrUpdateRating);

module.exports = router;
