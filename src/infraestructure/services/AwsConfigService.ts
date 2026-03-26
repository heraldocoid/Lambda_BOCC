import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

class AwsConfigService {
    private secretsClient: SecretsManagerClient;
    private ssmClient: SSMClient;
    
    private secretsCache: Record<string, any> = {};
    private paramsCache: Record<string, string> = {};
    
    constructor() {
        this.secretsClient = new SecretsManagerClient({});
        this.ssmClient = new SSMClient({});
    }
    
    //SECRETS MANAGER
    async getSecret(secretArn: string) {
        if(this.secretsCache[secretArn]){
            return this.secretsCache[secretArn];
        }

        const command = new GetSecretValueCommand({
            SecretId: secretArn,
        });

        const response = await this.secretsClient.send(command);

        if(!response.SecretString){
            throw new Error("Secret vacio");
        }

        const parsed = JSON.parse(response.SecretString);

        this.secretsCache[secretArn] = parsed;
        
        return parsed;
    }

    //SSM PARAMETER STORE
    async getParameter(name: string) {
        if (this.paramsCache[name]) {
            return this.paramsCache[name];
        }

        const command = new GetParameterCommand({
            Name: name,
            WithDecryption: true,
        });

        const response = await this.ssmClient.send(command);

        const value = response.Parameter?.Value;

        if (!value) {
            throw new Error(`Parameter ${name} vacío`);
        }

        this.paramsCache[name] = value;

        return value;
    }

    export default new AwsConfigService();
}