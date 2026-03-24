import { Pool } from 'pg';

/**
 * @Author: Leonardo S Ruiz Rodriguez
 * Client for connection with PostgreSQL
 * This class is reused between Lambda executions
 */

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
});

export default pool;
