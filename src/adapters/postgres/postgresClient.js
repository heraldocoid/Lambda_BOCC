const { Pool } = require('pg');

// Reuse global pool across Lambda warm starts to avoid exhausting connections.
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
