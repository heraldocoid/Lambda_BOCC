import { SecretConfigService } from '../infraestructure/services/SecretConfigService';
import { ParameterStoreService } from '../infraestructure/services/ParameterStoreService';
import { SecretManagerService } from '../infraestructure/services/SecretManagerService';

/**
 * 
 * Pruebas unitarias para el servicio de configuración de secretos
 * 
 * @description: Tests for checking SecretConfigService initialization and caching
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */
jest.mock('../infraestructure/services/ParameterStoreService');
jest.mock('../infraestructure/services/SecretManagerService');

describe('SecretConfigService', () => {
  let ssmMock: jest.Mocked<ParameterStoreService>;
  let secretsMock: jest.Mocked<SecretManagerService>;

  beforeEach(() => {
    jest.resetAllMocks();
    // Clear Singleton instance for each test
    (SecretConfigService as any).instance = undefined;
    
    // Setup environment variables
    process.env.ARN_SECRET = 'arn:secret:123';
    process.env.AWS_REGION = 'us-east-1';

    ssmMock = new ParameterStoreService() as any;
    secretsMock = new SecretManagerService() as any;

    // Make constructors return our mocks
    (ParameterStoreService as jest.Mock).mockImplementation(() => ssmMock);
    (SecretManagerService as jest.Mock).mockImplementation(() => secretsMock);
  });

  it('should initialize config properly when AWS returns values', async () => {
    ssmMock.getParameter.mockResolvedValueOnce('db-name').mockResolvedValueOnce('db-host');
    secretsMock.getSecret.mockResolvedValueOnce({
      acoDbUser: 'user',
      acoDbPass: 'pass',
    });

    const instance = SecretConfigService.getInstance();
    await instance.initialize();

    const config = instance.getAll();
    expect(config.DB_NAME).toBe('db-name');
    expect(config.DB_HOST).toBe('db-host');
    expect(config.DB_USER).toBe('user');
    expect(config.DB_PASS).toBe('pass');
    
    expect(ssmMock.getParameter).toHaveBeenCalledTimes(2);
    expect(ssmMock.getParameter).toHaveBeenCalledWith('/ACO/BOCC/dbName');
    expect(ssmMock.getParameter).toHaveBeenCalledWith('/ACO/BOCC/dbHost');
    expect(secretsMock.getSecret).toHaveBeenCalledWith('arn:secret:123');
  });

  it('should not fetch secrets again if already initialized (caching)', async () => {
    ssmMock.getParameter.mockResolvedValueOnce('db-name').mockResolvedValueOnce('db-host');
    secretsMock.getSecret.mockResolvedValueOnce({
      acoDbUser: 'user',
      acoDbPass: 'pass',
    });

    const instance = SecretConfigService.getInstance();
    await instance.initialize();
    await instance.initialize(); // Second call

    expect(ssmMock.getParameter).toHaveBeenCalledTimes(2); // Still only 2 calls total
  });

  it('should throw error if ARN_SECRET is missing', async () => {
    delete process.env.ARN_SECRET;
    const instance = SecretConfigService.getInstance();
    await expect(instance.initialize()).rejects.toThrow('ARN_SECRET environment variable is not defined');
  });

  it('should throw error if any value from AWS is missing', async () => {
    ssmMock.getParameter.mockResolvedValue(undefined as any);
    secretsMock.getSecret.mockResolvedValue(null as any);

    const instance = SecretConfigService.getInstance();
    await expect(instance.initialize()).rejects.toThrow('Could not fetch all required database secrets and parameters');
  });
});
