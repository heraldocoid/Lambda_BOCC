"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = require("pg");
/**
 * Adapter: Postgres client (TypeScript)
 * - Reuses a single Pool across warm Lambda starts to avoid exhausting
 *   database connections.
 * - Exposes a typed `query` wrapper and the underlying pool when needed.
 */
let pool = global.__pgPool;
exports.pool = pool;
if (!pool) {
    exports.pool = pool = new pg_1.Pool({
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
    }
    catch (err) {
        const e = new Error('Postgres query failed');
        e.type = 'DB';
        e.original = err;
        throw e;
    }
}
