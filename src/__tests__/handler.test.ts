import { handler } from '../handler';
import { SecretConfigService } from '../infraestructure/services/SecretConfigService';
import { UserService } from '../application/use-cases/UserService';
import { PgUserRepository } from '../infraestructure/repositories/PgUserRepository';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

/**
 * 
 * Pruebas unitarias para el handler principal de la Lambda
 * 
 * @description: Core integration tests for the Lambda entry point
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */
jest.mock('../infraestructure/services/SecretConfigService');
jest.mock('../application/use-cases/UserService');
jest.mock('../infraestructure/repositories/PgUserRepository');

describe('Lambda Handler', () => {
  let mockEvent: Partial<APIGatewayProxyEvent>;
  let mockContext: Partial<Context>;
  let secretConfigMock: jest.Mocked<SecretConfigService>;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockEvent = {
      httpMethod: 'GET',
      body: null,
      queryStringParameters: {},
    };

    mockContext = {};

    // Mock SecretConfigService singleton
    secretConfigMock = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getAll: jest.fn().mockReturnValue({
        DB_HOST: 'host', DB_USER: 'user', DB_PASS: 'pass', DB_NAME: 'name'
      }),
      get: jest.fn()
    } as any;
    (SecretConfigService.getInstance as jest.Mock).mockReturnValue(secretConfigMock);

    // Mock UserService
    userServiceMock = {
      getAllUsers: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as any;
    (UserService as jest.Mock).mockReturnValue(userServiceMock);
  });

  it('should call initialize and return all users for GET', async () => {
    const users = [{ id: '123', name: 'John', email: 'john@example.com' }];
    userServiceMock.getAllUsers.mockResolvedValue(users);

    const result = await handler(mockEvent as APIGatewayProxyEvent, mockContext as Context);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(users);
    expect(secretConfigMock.initialize).toHaveBeenCalled();
  });

  it('should create a user for POST', async () => {
    mockEvent.httpMethod = 'POST';
    mockEvent.body = JSON.stringify({ name: 'John', email: 'john@example.com' });
    
    userServiceMock.createUser.mockResolvedValue({ success: true, data: { id: '123', name: 'John', email: 'john@example.com' } });

    const result = await handler(mockEvent as APIGatewayProxyEvent, mockContext as Context);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body).success).toBe(true);
  });

  it('should return 500 when initialization fails', async () => {
    secretConfigMock.initialize.mockRejectedValue(new Error('Fatal error during secret fetching'));

    const result = await handler(mockEvent as APIGatewayProxyEvent, mockContext as Context);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe('Internal server error');
  });

  it('should return 405 for unsupported method', async () => {
    mockEvent.httpMethod = 'PATCH';

    const result = await handler(mockEvent as APIGatewayProxyEvent, mockContext as Context);

    expect(result.statusCode).toBe(405);
  });
});
