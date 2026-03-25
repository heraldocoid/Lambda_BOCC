import { Pool } from 'pg';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

/**
 * Adapter: Postgres client (TypeScript)
 * - Reuses a single Pool across warm Lambda starts to avoid exhausting
 *   database connections.
 * - Exposes a typed `query` wrapper and the underlying pool when needed.
 */
// Cache credentials in global to avoid repeated calls to SSM/Secrets Manager
type DBCreds = {
  host?: string;
  database?: string;
  user?: string;
  password?: string;
  port?: number;
};

const REGION = process.env.ENV_REGION || 'us-east-1';
const SSM_HOST = '/ACO/BOCC/dbHost';
const SSM_NAME = '/ACO/BOCC/dbName';
const SECRET_USER = 'acoDbUser';
const SECRET_PASS = 'acoDbPass';

const ssmClient = new SSMClient({ region: REGION });
const secretsClient = new SecretsManagerClient({ region: REGION });

async function fetchSSMParameter(name: string): Promise<string | undefined> {
  try {
    const cmd = new GetParameterCommand({ Name: name, WithDecryption: true });
    const res = await ssmClient.send(cmd);
    return res.Parameter?.Value;
  } catch (err) {
    return undefined;
  }
}

async function fetchSecretValue(name: string): Promise<string | undefined> {
  try {
    const cmd = new GetSecretValueCommand({ SecretId: name });
    const res = await secretsClient.send(cmd);
    if (res.SecretString) return res.SecretString;
    return undefined;
  } catch (err) {
    return undefined;
  }
}

async function resolveCreds(): Promise<DBCreds> {
  // Local env override (fast path)
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS && process.env.DB_NAME) {
    return {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: Number(process.env.ACO_DB_PORT || process.env.DB_PORT || 5432),
    };
  }

  // Check global cache
  const g: any = global as any;
  if (g.__acoDbCreds) return g.__acoDbCreds as DBCreds;

  // Read from SSM + Secrets Manager
  const [host, database, userSecret, passSecret] = await Promise.all([
    fetchSSMParameter(SSM_HOST),
    fetchSSMParameter(SSM_NAME),
    fetchSecretValue(SECRET_USER),
    fetchSecretValue(SECRET_PASS),
  ]);

  const creds: DBCreds = {
    host: host || process.env.DB_HOST,
    database: database || process.env.DB_NAME,
    user: undefined,
    password: undefined,
    port: Number(process.env.ACO_DB_PORT || process.env.DB_PORT || 5432),
  };

  // Secrets may be JSON or raw string; attempt JSON parse
  try {
    if (userSecret) {
      try {
        const parsed = JSON.parse(userSecret);
        creds.user = parsed.username || parsed.user || parsed.name || String(parsed);
      } catch {
        creds.user = userSecret;
      }
    }
    if (passSecret) {
      try {
        const parsed = JSON.parse(passSecret);
        creds.password = parsed.password || parsed.pass || String(parsed);
      } catch {
        creds.password = passSecret;
      }
    }
  } catch (err) {
    // ignore parsing errors and fallback to undefined
  }

  // Fallback to DB_* env vars if secrets missing
  creds.user = creds.user || process.env.DB_USER;
  creds.password = creds.password || process.env.DB_PASS;

  // Cache on global
  g.__acoDbCreds = creds;
  return creds;
}

// Ensure a single Pool across warm starts
const g: any = global as any;
let pool: Pool | undefined = g.__pgPool;

async function ensurePool(): Promise<Pool> {
  if (pool) return pool;
  try {
    const creds = await resolveCreds();
    if (!creds.host || !creds.user || !creds.password || !creds.database) {
      // Missing critical data -> throw DB error so caller can handle
      const e: any = new Error('Database credentials incomplete');
      e.type = 'DB';
      throw e;
    }

    pool = new Pool({
      host: creds.host,
      user: creds.user,
      password: creds.password,
      database: creds.database,
      port: creds.port || 5432,
    });
    g.__pgPool = pool;
    return pool;
  } catch (err: any) {
    const e: any = new Error('Failed to create Postgres pool');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

export async function query(text: string, params?: any[]) {
  try {
    const p = await ensurePool();
    return await p.query(text, params);
  } catch (err: any) {
    const e: any = new Error('Postgres query failed');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

export { ensurePool as pool };
