/**
 * Jest test for createItem use-case
 * - Mocks repository so no DB is required
 * - This test verifies the behaviour of the `createItem` use-case (unit)
 *   and intentionally mocks the repository (ports) to keep it fast and
 *   deterministic. Tests should validate behaviour, not implementation.
 */
const createItem = require('../src/application/use-cases/items/createItem').default;

describe('createItem use-case', () => {
  test('creates item when valid input provided', async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({ id: 1, name: 'Test', description: 'd', status: 's', created_at: '2020-01-01' }),
    };

    const payload = { name: 'Test', description: 'd', status: 's' };
    const result = await createItem(mockRepo, payload);

    expect(mockRepo.create).toHaveBeenCalledWith({ name: 'Test', description: 'd', status: 's' });
    expect(result).toHaveProperty('id', 1);
  });

  test('throws validation error when name is missing', async () => {
    const mockRepo = { create: jest.fn() };
    await expect(createItem(mockRepo, { description: 'x' })).rejects.toMatchObject({ type: 'VALIDATION' });
  });
});
