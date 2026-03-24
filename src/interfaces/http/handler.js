/**
 * Lambda HTTP handler (single entry point)
 * - Translates API Gateway events into calls to application use-cases
 * - Does NOT contain business logic or DB access; delegates to use-cases and repository
 */
const createItem = require('../../application/use-cases/createItem');
const getItem = require('../../application/use-cases/getItem');
const updateItem = require('../../application/use-cases/updateItem');
const deleteItem = require('../../application/use-cases/deleteItem');
const createItemRepository = require('../../infrastructure/db/itemRepository');

// instantiate repository once per cold-start
const repository = createItemRepository();

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

module.exports.handler = async function handler(event) {
  try {
    const method = event.httpMethod;
    const pathParams = event.pathParameters || {};
    const id = pathParams.id;

    if (method === 'POST' && !id) {
      const payload = event.body ? JSON.parse(event.body) : {};
      const created = await createItem(repository, payload);
      return jsonResponse(201, created);
    }

    if (method === 'GET' && id) {
      const found = await getItem(repository, id);
      return jsonResponse(200, found);
    }

    if (method === 'PUT' && id) {
      const payload = event.body ? JSON.parse(event.body) : {};
      const updated = await updateItem(repository, id, payload);
      return jsonResponse(200, updated);
    }

    if (method === 'DELETE' && id) {
      await deleteItem(repository, id);
      return jsonResponse(204, {});
    }

    return jsonResponse(404, { message: 'Not Found' });
  } catch (err) {
    if (err && err.type === 'VALIDATION') return jsonResponse(400, { message: err.message });
    if (err && err.type === 'NOT_FOUND') return jsonResponse(404, { message: err.message });
    console.error(err);
    return jsonResponse(500, { message: 'Internal Server Error' });
  }
};
