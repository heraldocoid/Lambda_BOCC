import updateUser from '../../src/application/use-cases/users/updateUser';

describe('updateUser use-case', () => {
  test('updates user fields when valid', async () => {
    const mockRepo = { update: jest.fn().mockResolvedValue({ id: 'u1', name: 'Bob', email: 'b@b.com', createdAt: new Date() }) };
    const result = await updateUser(mockRepo, 'u1', { name: 'Bob', email: 'b@b.com' });
    expect(mockRepo.update).toHaveBeenCalledWith('u1', expect.objectContaining({ name: 'Bob', email: 'b@b.com' }));
    expect(result).toHaveProperty('name', 'Bob');
  });

  test('throws validation when no fields', async () => {
    const mockRepo = { update: jest.fn() };
    await expect(updateUser(mockRepo, 'u1', {} as any)).rejects.toMatchObject({ type: 'VALIDATION' });
  });
});
