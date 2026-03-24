import { Pool } from 'pg';
import { SecretConfigService } from '../services/SecretConfigService';

/**
 * 
 * Configuración de pool de conexiones para PostgreSQL
 * 
 * @description: Database connection pool configuration
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
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
