import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export class ParameterStoreService {
  private readonly client: SSMClient;

  constructor(region: string = process.env.AWS_REGION || 'us-east-1') {
    this.client = new SSMClient({ region });
  }

  /**
   * Fetches a parameter from AWS SSM Parameter Store
   * @param name Name of the parameter
   * @param withDecryption Whether to decrypt a SecureString
   */
  async getParameter(name: string, withDecryption: boolean = true): Promise<string | undefined> {
    try {
      const command = new GetParameterCommand({
        Name: name,
        WithDecryption: withDecryption,
      });

      const response = await this.client.send(command);
      return response.Parameter?.Value;
    } catch (error) {
      console.error(`Error retrieving parameter ${name}:`, error);
      throw new Error(`Failed to retrieve parameter: ${name}`);
    }
  }
}
