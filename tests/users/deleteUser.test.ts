/**
 * Unit tests for `deleteUser` use-case. Repository is mocked to avoid DB.
 */
import deleteUser from '../../src/application/use-cases/users/deleteUser';

describe('deleteUser use-case', () => {
  test('deletes when exists', async () => {
    const mockRepo = { delete: jest.fn().mockResolvedValue(true) };
    const res = await deleteUser(mockRepo, 'u1');
    expect(mockRepo.delete).toHaveBeenCalledWith('u1');
    expect(res).toEqual({ deleted: true });
  });

  test('throws NOT_FOUND when missing', async () => {
    const mockRepo = { delete: jest.fn().mockResolvedValue(false) };
    await expect(deleteUser(mockRepo, 'uX')).rejects.toMatchObject({ type: 'NOT_FOUND' });
  });
});
