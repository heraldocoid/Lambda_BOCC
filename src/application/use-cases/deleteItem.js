/**
 * Use-case: deleteItem
 * - Validates id
 * - Delegates deletion to repository
 */
module.exports = async function deleteItem(repository, id) {
  if (!id) { const e = new Error('`id` is required'); e.type = 'VALIDATION'; throw e; }
  const parsed = parseInt(id, 10);
  if (Number.isNaN(parsed) || parsed <= 0) { const e = new Error('Invalid `id`'); e.type = 'VALIDATION'; throw e; }

  const ok = await repository.delete(parsed);
  if (!ok) { const e = new Error('Item not found'); e.type = 'NOT_FOUND'; throw e; }
  return { deleted: true };
};
