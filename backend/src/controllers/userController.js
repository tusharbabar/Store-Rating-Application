const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { validateFields } = require('../utils/validators');

const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const storeCount = await query('SELECT COUNT(*) as count FROM stores');
    const ratingCount = await query('SELECT COUNT(*) as count FROM ratings');
    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const errors = validateFields({ name, email, password, address, isSignupOrCreate: true });
  if (!['USER', 'ADMIN', 'STORE_OWNER'].includes(role)) {
    errors.push('Role must be ADMIN, USER, or STORE_OWNER');
  }
  if (errors.length > 0) return res.status(400).json({ errors });
  try {
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email is already registered' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  const { search = '', role = '' } = req.query;
  try {
    let sql = `
      SELECT u.id, u.name, u.email, u.address, u.role,
             s.id as store_id,
             COALESCE(ROUND(AVG(r.rating), 2), null) as storeRating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE (u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)
    `;
    const params = [`%${search}%`, `%${search}%`, `%${search}%`];

    if (role) {
      sql += ` AND u.role = ?`;
      params.push(role);
    }
    sql += ` GROUP BY u.id, u.name, u.email, u.address, u.role, s.id`;
    const users = await query(sql, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAdminDashboard, addUser, getUsers };
