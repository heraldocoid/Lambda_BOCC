import { ParameterStoreService } from './ParameterStoreService';
import { SecretManagerService } from './SecretManagerService';

/**
 * 
 * Clase de configuración de secretos y parametros de AWS
 * 
 * @description: Service to fetch secrets from AWS Parameter Store and Secrets Manager
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */
export class SecretConfigService {
  private static instance: SecretConfigService;
  private config: Record<string, string> = {};
  private ssmService: ParameterStoreService;
  private secretsService: SecretManagerService;

  private constructor() {
    this.ssmService = new ParameterStoreService(process.env.AWS_REGION);
    this.secretsService = new SecretManagerService(process.env.AWS_REGION);
  }

  public static getInstance(): SecretConfigService {
    if (!SecretConfigService.instance) {
      SecretConfigService.instance = new SecretConfigService();
    }
    return SecretConfigService.instance;
  }

  private initialized = false;

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    const arnSecret = process.env.ARN_SECRET;

    if (!arnSecret) {
      throw new Error('ARN_SECRET environment variable is not defined');
    }

    // 1. Fetch Parameter Store: DB_NAME, DB_HOST
    const dbNameParam = '/ACO/BOCC/dbName';
    const dbHostParam = '/ACO/BOCC/dbHost';

    const dbName = await this.ssmService.getParameter(dbNameParam);
    const dbHost = await this.ssmService.getParameter(dbHostParam);

    console.log('dbName from SSM: ', dbName);
    console.log('dbHost from SSM: ', dbHost);

    // 2. Fetch Secret Manager: DB_USER, DB_PASS via ARN_SECRET
    const dbUserKey = 'acoDbUser';
    const dbPassKey = 'acoDbPass';

    const dbSecrets = await this.secretsService.getSecret<Record<string, string>>(arnSecret);

    if (!dbName || !dbHost || !dbSecrets || !dbSecrets[dbUserKey] || !dbSecrets[dbPassKey]) {
      throw new Error('Could not fetch all required database secrets and parameters');
    }

    this.config = {
      DB_NAME: dbName,
      DB_HOST: dbHost,
      DB_USER: dbSecrets[dbUserKey],
      DB_PASS: dbSecrets[dbPassKey],
    };

    this.initialized = true;
  }

  public get(key: string): string {
    if (!this.initialized) {
      throw new Error('SecretConfigService has not been initialized. Call initialize() first.');
    }
    const value = this.config[key];
    if (!value) {
      throw new Error(`Configuration key ${key} is missing or empty after initialization.`);
    }
    return value;
  }

  public getAll() {
    if (!this.initialized) {
      throw new Error('SecretConfigService has not been initialized. Call initialize() first.');
    }
    return this.config;
  }
}
