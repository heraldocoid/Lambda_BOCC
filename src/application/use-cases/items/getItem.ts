import { Item } from '../../../domain/item';

export default async function getItem(repository: any, id: any): Promise<Item> {
  if (!id) { const e: any = new Error('`id` is required'); e.type = 'VALIDATION'; throw e; }
  const parsed = parseInt(String(id), 10);
  if (Number.isNaN(parsed) || parsed <= 0) { const e: any = new Error('Invalid `id`'); e.type = 'VALIDATION'; throw e; }

  const item = await repository.findById(parsed);
  if (!item) { const e: any = new Error('Item not found'); e.type = 'NOT_FOUND'; throw e; }
  return item as Item;
}
