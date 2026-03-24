export default async function deleteItem(repository: any, id: any) {
  if (!id) { const e: any = new Error('`id` is required'); e.type = 'VALIDATION'; throw e; }
  const parsed = parseInt(String(id), 10);
  if (Number.isNaN(parsed) || parsed <= 0) { const e: any = new Error('Invalid `id`'); e.type = 'VALIDATION'; throw e; }

  const ok = await repository.delete(parsed);
  if (!ok) { const e: any = new Error('Item not found'); e.type = 'NOT_FOUND'; throw e; }
  return { deleted: true };
}
