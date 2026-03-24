const { Pool } = require('pg');

/**
 * Adapter: Postgres client
 * - Reuses a single `Pool` across warm Lambda starts to avoid exhausting
 *   database connections.
 * - Wraps `pool.query` and rethrows errors with a typed `err.type = 'DB'` so
 *   application layers can map and handle DB failures uniformly.
 */
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
