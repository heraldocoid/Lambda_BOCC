/**
 * Unit tests for `getUser` use-case. Mocks repository port; validates behavior.
 */
import getUser from '../../src/application/use-cases/users/getUser';

describe('getUser use-case', () => {
  test('returns user when found', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue({ id: 'u1', name: 'Alice', email: 'a@b.com', createdAt: new Date() }) };
    const result = await getUser(mockRepo, 'u1');
    expect(mockRepo.findById).toHaveBeenCalledWith('u1');
    expect(result).toHaveProperty('id', 'u1');
  });

  test('throws NOT_FOUND when missing', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    await expect(getUser(mockRepo, 'uX')).rejects.toMatchObject({ type: 'NOT_FOUND' });
  });
});
