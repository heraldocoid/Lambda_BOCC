import { User } from '../../../domain/user';

/**
 * Use-case: createUser
 * - Validates input and delegates to repository
 * - Repository is injected to keep use-case pure and testable
 */
export default async function createUser(repository: any, data: Partial<User>): Promise<User> {
  if (!data || typeof data !== 'object') {
    const e: any = new Error('Invalid input');
    e.type = 'VALIDATION';
    throw e;
  }
  const { id, name, email } = data as User;
  if (!id || typeof id !== 'string' || !id.trim()) {
    const e: any = new Error('`id` is required and must be a non-empty string');
    e.type = 'VALIDATION';
    throw e;
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    const e: any = new Error('`name` is required');
    e.type = 'VALIDATION';
    throw e;
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    const e: any = new Error('`email` is required');
    e.type = 'VALIDATION';
    throw e;
  }

  const toCreate: User = {
    id: id.trim(),
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date(),
  };

  const created = await repository.create(toCreate);
  return created;
}
