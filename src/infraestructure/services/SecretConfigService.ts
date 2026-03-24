import { ParameterStoreService } from './ParameterStoreService';
import { SecretManagerService } from './SecretManagerService';

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
    // These could be either the parameter names themselves or environment variables containing names.
    // Based on user "DB_NAME", we will fetch parameters named "DB_NAME" and "DB_HOST" or fetch values using these keys as names.
    const dbName = await this.ssmService.getParameter('DB_NAME');
    const dbHost = await this.ssmService.getParameter('DB_HOST');

    // 2. Fetch Secret Manager: DB_USER, DB_PASS via ARN_SECRET
    const dbSecrets = await this.secretsService.getSecret<{ DB_USER: string, DB_PASS: string }>(arnSecret);

    if (!dbName || !dbHost || !dbSecrets || !dbSecrets.DB_USER || !dbSecrets.DB_PASS) {
      throw new Error('Could not fetch all required database secrets and parameters');
    }

    this.config = {
      DB_NAME: dbName,
      DB_HOST: dbHost,
      DB_USER: dbSecrets.DB_USER,
      DB_PASS: dbSecrets.DB_PASS,
    };

    this.initialized = true;
  }

  public get(key: 'DB_NAME' | 'DB_HOST' | 'DB_USER' | 'DB_PASS'): string {
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
