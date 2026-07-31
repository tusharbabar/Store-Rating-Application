const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { validateFields } = require('../utils/validators');

const getAllStores = async (req, res) => {
  const { search = '' } = req.query;
  const userId = req.user ? req.user.id : 0;

  try {
    const filter = `%${search}%`;
    const sql = `
      SELECT s.id, s.name, s.address, s.email,
             COALESCE(ROUND(AVG(r.rating), 2), 0) as overallRating,
             COUNT(r.id) as ratingCount,
             (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.name LIKE ? OR s.address LIKE ?
      GROUP BY s.id, s.name, s.address, s.email
    `;
    const stores = await query(sql, [userId, filter, filter]);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addStore = async (req, res) => {
  const { name, email, address, ownerEmail, ownerPassword } = req.body;

  if (!name || name.trim().length === 0) return res.status(400).json({ error: 'Store Name is required' });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return res.status(400).json({ error: 'Valid Store Email is required' });
  if (!address || address.length > 400) return res.status(400).json({ error: 'Valid Address is required (max 400 chars)' });

  try {
    let ownerId = null;

    if (ownerEmail) {
      const owners = await query('SELECT * FROM users WHERE email = ?', [ownerEmail]);
      if (owners.length === 0) {
        if (!ownerPassword) return res.status(400).json({ error: 'Password required to create new store owner user' });
        const userErrors = validateFields({
          name: name.length >= 20 ? name : `${name} Store Owner User`,
          email: ownerEmail,
          password: ownerPassword,
          address,
          isSignupOrCreate: true
        });
        if (userErrors.length > 0) return res.status(400).json({ errors: userErrors });

        const hashedPass = bcrypt.hashSync(ownerPassword, 10);
        const newOwner = await query(
          'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [name.length >= 20 ? name : `${name} Store Owner User`, ownerEmail, hashedPass, address, 'STORE_OWNER']
        );
        ownerId = newOwner.insertId;
      } else {
        ownerId = owners[0].id;
        await query("UPDATE users SET role = 'STORE_OWNER' WHERE id = ?", [ownerId]);
      }
    }

    const result = await query(
      'INSERT INTO stores (name, email, address, owner_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: 'Store added successfully', storeId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;
  try {
    const stores = await query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
    if (stores.length === 0) {
      return res.json({ store: null, averageRating: 0, ratings: [] });
    }

    const store = stores[0];
    const avgResult = await query(
      'SELECT COALESCE(ROUND(AVG(rating), 2), 0) as avgRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const ratingsList = await query(
      `SELECT r.id, r.rating, r.updatedAt, u.name as userName, u.email as userEmail, u.address as userAddress
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.updatedAt DESC`,
      [store.id]
    );

    res.json({
      store,
      averageRating: avgResult[0].avgRating,
      ratings: ratingsList
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllStores, addStore, getOwnerDashboard };
