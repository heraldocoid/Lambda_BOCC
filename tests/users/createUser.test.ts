/**
 * Unit tests for `createUser` use-case.
 * - These tests mock the repository port to ensure the use-case logic
 *   is validated in isolation from infrastructure.
 */
import createUser from '../../src/application/use-cases/users/createUser';

describe('createUser use-case', () => {
  test('creates user with valid input', async () => {
    const mockRepo = { create: jest.fn().mockResolvedValue({ id: 'u1', name: 'Alice', email: 'a@b.com', createdAt: new Date() }) };
    const payload = { id: 'u1', name: 'Alice', email: 'a@b.com' };
    const result = await createUser(mockRepo, payload);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1', name: 'Alice', email: 'a@b.com' }));
    expect(result).toHaveProperty('id', 'u1');
  });

  test('throws validation error when name missing', async () => {
    const mockRepo = { create: jest.fn() };
    await expect(createUser(mockRepo, { id: 'u2', email: 'x@y.com' } as any)).rejects.toMatchObject({ type: 'VALIDATION' });
  });
});
