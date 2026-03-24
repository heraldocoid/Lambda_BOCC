import { Pool } from 'pg';
import { SecretConfigService } from '../services/SecretConfigService';

/**
 * @Author: Leonardo S Ruiz Rodriguez
 * Client for connection with PostgreSQL
 * This class is reused between Lambda executions
 */

let poolInstance: Pool | null = null;

const getPool = (): Pool => {
  if (!poolInstance) {
    const config = SecretConfigService.getInstance().getAll();

    poolInstance = new Pool({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
      port: 5432,
    });
  }
  return poolInstance;
};

export default getPool;
