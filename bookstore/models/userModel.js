const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function findByEmail(email) {
  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return user;
}

async function findById(id) {
  const [[user]] = await pool.query('SELECT id, full_name, email, role, address, created_at FROM users WHERE id = ?', [id]);
  return user;
}

async function create({ full_name, email, password, address }) {
  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, password_hash, address) VALUES (?, ?, ?, ?)',
    [full_name, email, password_hash, address || null]
  );
  return result.insertId;
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { findByEmail, findById, create, verifyPassword };
