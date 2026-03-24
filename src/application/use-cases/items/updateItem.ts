import { Item } from '../../../domain/item';

export default async function updateItem(repository: any, id: any, data: Partial<Item>): Promise<Item> {
  if (!id) { const e: any = new Error('`id` is required'); e.type = 'VALIDATION'; throw e; }
  const parsed = parseInt(String(id), 10);
  if (Number.isNaN(parsed) || parsed <= 0) { const e: any = new Error('Invalid `id`'); e.type = 'VALIDATION'; throw e; }
  if (!data || typeof data !== 'object') { const e: any = new Error('Invalid input'); e.type = 'VALIDATION'; throw e; }

  const fields: any = {};
  if (Object.prototype.hasOwnProperty.call(data, 'name')) {
    if (!data.name || typeof data.name !== 'string' || !String(data.name).trim()) {
      const e: any = new Error('`name` must be a non-empty string'); e.type = 'VALIDATION'; throw e;
    }
    fields.name = String(data.name).trim();
  }
  if (Object.prototype.hasOwnProperty.call(data, 'description')) {
    fields.description = data.description === null ? null : data.description;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'status')) {
    fields.status = data.status === null ? null : data.status;
  }

  if (Object.keys(fields).length === 0) { const e: any = new Error('No fields to update'); e.type = 'VALIDATION'; throw e; }

  const updated = await repository.update(parsed, fields);
  if (!updated) { const e: any = new Error('Item not found'); e.type = 'NOT_FOUND'; throw e; }
  return updated as Item;
}
