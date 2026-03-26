import { Pool } from "pg";
import awsConfig from "../service/AwsConfigService.ts";

/**
 * @Author: Leonardo S Ruiz Rodriguez
 * Client for connection with PostgreSQL
 * This class is reused between Lambda executions
 */

let pool: Pool;

async function createPool():Promise<Pool> {
  if(pool) return pool;

  const secret = await awsConfig.getSecret(
    process.env.DB_SECRET_ARN as string
  );

  pool = new Pool({
    host: secret.host,
    user: secret.username,
    password: secret.password,
    database: secret.dbname,
    port: 5432,
  });

  return pool;
}

export default createPool;