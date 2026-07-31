const express = require('express');
const router = express.Router();
const { getAdminDashboard, addUser, getUsers } = require('../controllers/userController');
const { getAllStores, addStore } = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken, authorizeRoles('ADMIN', 'SYSTEM_ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.post('/stores', addStore);
router.get('/stores', getAllStores);
router.post('/users', addUser);
router.get('/users', getUsers);

module.exports = router;
