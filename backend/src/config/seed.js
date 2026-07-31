const { query } = require('./db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  console.log('Seeding MySQL Database...');

  try {
    // Clear old data
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('TRUNCATE TABLE ratings');
    await query('TRUNCATE TABLE stores');
    await query('TRUNCATE TABLE users');
    await query('SET FOREIGN_KEY_CHECKS = 1');

    const adminPass = bcrypt.hashSync('Admin@1234', 10);
    const userPass = bcrypt.hashSync('User@12345', 10);
    const ownerPass = bcrypt.hashSync('Owner@1234', 10);

    const adminRes = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['System Administrator Master User Account', 'admin@storerating.com', adminPass, '123 Tech Park Executive Suite, Silicon Valley, CA 94025', 'ADMIN']
    );

    const user1Res = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['Johnathan Alexander Super User Specialist', 'john.doe@example.com', userPass, '456 Elm Street, Apt 4B, Springfield, NY 10001', 'USER']
    );

    const user2Res = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['Sarah Elizabeth Miller Senior Developer', 'sarah.m@example.com', userPass, '789 Oak Avenue, Suite 10, Boston, MA 02108', 'USER']
    );

    const owner1Res = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['Robert Store Owner Professional Manager', 'owner.tech@store.com', ownerPass, '12 Plaza Boulevard, Suite 5, Austin, TX 78701', 'STORE_OWNER']
    );

    const owner2Res = await query(
      'INSERT INTO users (name, email, password, address, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['Emily Store Owner Retail Franchise Exec', 'owner.fashion@store.com', ownerPass, '99 Fashion Drive, Suite 22, Chicago, IL 60601', 'STORE_OWNER']
    );

    const store1Res = await query(
      'INSERT INTO stores (name, email, address, owner_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['TechGear Store Emporium', 'contact@techgear.com', '12 Plaza Boulevard, Austin, TX 78701', owner1Res.insertId]
    );

    const store2Res = await query(
      'INSERT INTO stores (name, email, address, owner_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Urban Style Apparel & Trends', 'info@urbanstyle.com', '99 Fashion Drive, Chicago, IL 60601', owner2Res.insertId]
    );

    const store3Res = await query(
      'INSERT INTO stores (name, email, address, owner_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      ['Fresh Organic Grocery Hub', 'support@freshorganic.com', '500 Green Meadow Lane, Seattle, WA 98101', null]
    );

    await query('INSERT INTO ratings (user_id, store_id, rating, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [user1Res.insertId, store1Res.insertId, 5]);
    await query('INSERT INTO ratings (user_id, store_id, rating, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [user2Res.insertId, store1Res.insertId, 4]);
    await query('INSERT INTO ratings (user_id, store_id, rating, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [user1Res.insertId, store2Res.insertId, 3]);
    await query('INSERT INTO ratings (user_id, store_id, rating, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [user2Res.insertId, store3Res.insertId, 5]);

    console.log('MySQL Database Seeded Successfully!');
  } catch (err) {
    console.error('Error Seeding Database:', err.message);
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
