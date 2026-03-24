/**
 * Use-case: updateItem
 * - Validates id and fields
 * - Returns updated item or throws NOT_FOUND
 */
module.exports = async function updateItem(repository, id, data) {
  if (!id) { const e = new Error('`id` is required'); e.type = 'VALIDATION'; throw e; }
  const parsed = parseInt(id, 10);
  if (Number.isNaN(parsed) || parsed <= 0) { const e = new Error('Invalid `id`'); e.type = 'VALIDATION'; throw e; }
  if (!data || typeof data !== 'object') { const e = new Error('Invalid input'); e.type = 'VALIDATION'; throw e; }

  const fields = {};
  if (Object.prototype.hasOwnProperty.call(data, 'name')) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      const e = new Error('`name` must be a non-empty string'); e.type = 'VALIDATION'; throw e;
    }
    fields.name = data.name.trim();
  }
  if (Object.prototype.hasOwnProperty.call(data, 'description')) {
    fields.description = data.description === null ? null : data.description;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'status')) {
    fields.status = data.status === null ? null : data.status;
  }

  if (Object.keys(fields).length === 0) { const e = new Error('No fields to update'); e.type = 'VALIDATION'; throw e; }

  const updated = await repository.update(parsed, fields);
  if (!updated) { const e = new Error('Item not found'); e.type = 'NOT_FOUND'; throw e; }
  return updated;
};
