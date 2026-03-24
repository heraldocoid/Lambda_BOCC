import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export class SecretManagerService {
  private readonly client: SecretsManagerClient;

  constructor(region: string = process.env.AWS_REGION || 'us-east-1') {
    this.client = new SecretsManagerClient({ region });
  }

  /**
   * Fetches a secret from AWS Secrets Manager and parses it as JSON if possible
   * @param secretId Name or ARN of the secret
   */
  async getSecret<T = any>(secretId: string): Promise<T | undefined> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: secretId,
      });

      const response = await this.client.send(command);
      
      if (response.SecretString) {
        try {
          return JSON.parse(response.SecretString) as T;
        } catch {
          // If it's not a JSON string, return as string
          return response.SecretString as unknown as T;
        }
      }

      // For binary secrets (SecretBinary)
      if (response.SecretBinary) {
        const buff = Buffer.from(response.SecretBinary);
        return buff.toString('utf-8') as unknown as T;
      }

      return undefined;
    } catch (error) {
      console.error(`Error retrieving secret ${secretId}:`, error);
      throw new Error(`Failed to retrieve secret: ${secretId}`);
    }
  }
}
