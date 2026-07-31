const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { validateFields } = require('../utils/validators');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const signup = async (req, res) => {
  const { name, email, password, address } = req.body;
  const errors = validateFields({ name, email, password, address, isSignupOrCreate: true });
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email is already registered.' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, address, 'USER']
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = users[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const errors = validateFields({ password: newPassword });
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const users = await query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0 || !bcrypt.compareSync(currentPassword, users[0].password)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNew = bcrypt.hashSync(newPassword, 10);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedNew, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login, updatePassword };
