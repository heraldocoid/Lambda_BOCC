/**
 * Use-case: createItem
 * - Validates input
 * - Delegates persistence to repository
 */
module.exports = async function createItem(repository, data) {
  if (!data || typeof data !== 'object') {
    const e = new Error('Invalid input'); e.type = 'VALIDATION'; throw e;
  }
  const { name, description, status } = data;
  if (!name || typeof name !== 'string' || !name.trim()) {
    const e = new Error('`name` is required'); e.type = 'VALIDATION'; throw e;
  }

  const toCreate = {
    name: name.trim(),
    description: description || null,
    status: status || null,
  };

  const created = await repository.create(toCreate);
  return created;
};
