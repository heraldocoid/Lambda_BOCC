import { Item } from '../../../domain/item';

/**
 * Use-case: createItem (TypeScript)
 * - Pure business logic: validates input and delegates persistence
 * - Receives a repository via dependency injection
 */
export default async function createItem(repository: any, data: Partial<Item>): Promise<Item> {
  if (!data || typeof data !== 'object') {
    const e: any = new Error('Invalid input');
    e.type = 'VALIDATION';
    throw e;
  }
  const { name, description, status } = data as Item;
  if (!name || typeof name !== 'string' || !name.trim()) {
    const e: any = new Error('`name` is required');
    e.type = 'VALIDATION';
    throw e;
  }

  const toCreate: Item = {
    name: name.trim(),
    description: description || null,
    status: status || null,
  } as Item;

  const created = await repository.create(toCreate);
  return created;
}
