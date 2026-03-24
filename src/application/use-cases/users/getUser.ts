import { User } from '../../../domain/user';

export default async function getUser(repository: any, id: string): Promise<User> {
  if (!id || typeof id !== 'string') {
    const e: any = new Error('`id` is required');
    e.type = 'VALIDATION';
    throw e;
  }
  const user = await repository.findById(id);
  if (!user) {
    const e: any = new Error('User not found');
    e.type = 'NOT_FOUND';
    throw e;
  }
  return user as User;
}
