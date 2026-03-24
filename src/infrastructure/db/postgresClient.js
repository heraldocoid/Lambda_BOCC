/**
 * Infrastructure: Postgres client
 * Exposes a minimal `query` wrapper around `pg` Pool for repository use.
 */
const { Pool } = require('pg');

// In serverless environments (Lambda with warm starts) creating multiple
// Pool instances can exhaust database connections. Reuse a global pool
// when available so the same Pool is shared across module reloads.
let pool = global.__pgPool;
if (!pool) {
  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  });
  global.__pgPool = pool;
}

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // Wrap DB errors so higher layers can react using `err.type`.
    const e = new Error('Postgres query failed');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

module.exports = {
  query,
  pool,
};
