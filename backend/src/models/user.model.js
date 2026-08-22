const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const SALT_ROUNDS = 12;

// Strips sensitive/internal fields before a user row is ever sent to the client
const toSafeUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};

const createUser = async ({ firstName, lastName, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [firstName, lastName, email.toLowerCase().trim(), hashedPassword]
  );
  return rows[0];
};

const comparePassword = (candidatePassword, hashedPassword) => bcrypt.compare(candidatePassword, hashedPassword);

// Bumping this invalidates every previously issued refresh token for the user (logout / password reset)
const incrementRefreshTokenVersion = async (id) => {
  const { rows } = await pool.query(
    `UPDATE users SET refresh_token_version = refresh_token_version + 1, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0];
};

const setPasswordResetToken = async (id, hashedToken, expiresAt) => {
  const { rows } = await pool.query(
    `UPDATE users SET password_reset_token = $1, password_reset_expires = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [hashedToken, expiresAt, id]
  );
  return rows[0];
};

const findByEmailAndValidResetToken = async (email, hashedToken) => {
  const { rows } = await pool.query(
    `SELECT * FROM users
     WHERE email = $1 AND password_reset_token = $2 AND password_reset_expires > NOW()`,
    [email.toLowerCase().trim(), hashedToken]
  );
  return rows[0] || null;
};

const resetPassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const { rows } = await pool.query(
    `UPDATE users
     SET password = $1,
         password_reset_token = NULL,
         password_reset_expires = NULL,
         refresh_token_version = refresh_token_version + 1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [hashedPassword, id]
  );
  return rows[0];
};

module.exports = {
  toSafeUser,
  findByEmail,
  findById,
  createUser,
  comparePassword,
  incrementRefreshTokenVersion,
  setPasswordResetToken,
  findByEmailAndValidResetToken,
  resetPassword,
};
