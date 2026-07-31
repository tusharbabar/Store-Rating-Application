const { query } = require('../config/db');

const submitOrUpdateRating = async (req, res) => {
  const storeId = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
  }

  try {
    const existing = await query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
    if (existing.length > 0) {
      await query('UPDATE ratings SET rating = ? WHERE id = ?', [rating, existing[0].id]);
      res.json({ message: 'Rating updated successfully' });
    } else {
      await query('INSERT INTO ratings (user_id, store_id, rating, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [userId, storeId, rating]);
      res.json({ message: 'Rating submitted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitOrUpdateRating };
