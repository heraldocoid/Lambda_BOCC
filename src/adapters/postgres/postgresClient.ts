import { Pool } from 'pg';

/**
 * Adapter: Postgres client (TypeScript)
 * - Reuses a single Pool across warm Lambda starts to avoid exhausting
 *   database connections.
 * - Exposes a typed `query` wrapper and the underlying pool when needed.
 */
let pool: Pool | undefined = (global as any).__pgPool;
if (!pool) {
  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  });
  (global as any).__pgPool = pool;
}

export async function query(text: string, params?: any[]) {
  try {
    return await pool!.query(text, params);
  } catch (err: any) {
    const e: any = new Error('Postgres query failed');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

export { pool };
