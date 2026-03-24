import { UserService } from '../application/use-cases/UserService';
import { UserRepository } from '../domain/repositories/UserRepository';
import { User } from '../domain/entities/User';

/**
 * 
 * Pruebas unitarias para el servicio de usuarios
 * 
 * @description: Tests for checking UserService logic with mocked repository
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */
describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    userService = new UserService(mockRepository);
  });

  it('should create a user when data is valid', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const createdUser: User = { id: 'uuid-123', ...userData };
    
    mockRepository.create.mockResolvedValue(createdUser);

    const result = await userService.createUser(userData);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(createdUser);
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('should not create a user when data is invalid', async () => {
    const userData = { email: 'john@example.com' }; // missing name
    
    const result = await userService.createUser(userData);

    expect(result.success).toBe(false);
    expect(result.errors).toContain('El nombre es obligatorio.');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should get all users', async () => {
    const users: User[] = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];
    
    mockRepository.findAll.mockResolvedValue(users);

    const result = await userService.getAllUsers();

    expect(result).toEqual(users);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should find user by id', async () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    mockRepository.findById.mockResolvedValue(user);

    const result = await userService.getUserById('1');

    expect(result).toEqual(user);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should delete a user', async () => {
    mockRepository.delete.mockResolvedValue(true);

    const result = await userService.deleteUser('1');

    expect(result).toBe(true);
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });
});
