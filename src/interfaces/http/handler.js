/**
 * Lambda HTTP handler (single entry point)
 * Role: translate API Gateway events into calls to application use-cases.
 * - No business logic here; the handler must only perform validation/parsing
 *   of the transport (HTTP) and delegate to application/use-cases.
 */
/**
 * Lambda HTTP handler (single entry point)
 * Role: translate API Gateway events into calls to application use-cases.
 * This file is intentionally thin: no business logic lives here — only
 * parsing/validation of transport concerns and delegation to use-cases.
 */
const createItem = require('../../application/use-cases/createItem');
const getItem = require('../../application/use-cases/getItem');
const updateItem = require('../../application/use-cases/updateItem');
const deleteItem = require('../../application/use-cases/deleteItem');
const createItemRepository = require('../../adapters/postgres/itemRepository');

// User use-cases (TypeScript sources). These are part of the application
// layer and accept a repository via dependency injection. In a full build
// pipeline the TS files are transpiled to JS before deployment.
const createUser = require('../../src/application/use-cases/users/createUser').default;
const getUser = require('../../src/application/use-cases/users/getUser').default;
const updateUser = require('../../src/application/use-cases/users/updateUser').default;
const deleteUser = require('../../src/application/use-cases/users/deleteUser').default;
const createUserRepository = require('../../adapters/postgres/userRepository');

// Instantiate repository once per cold start. This is dependency injection
// at the module level for simplicity in a small project; in larger apps
// consider a DI container or explicit wiring function for testing.
const repository = createItemRepository();

function jsonResponse(statusCode, body) {
  const headers = { 'Content-Type': 'application/json' };
  // For 204 No Content return an empty body string (API Gateway expects string)
  return {
    statusCode,
    headers,
    body: statusCode === 204 ? '' : JSON.stringify(body),
  };
}

function parseBody(event) {
  if (!event || !event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (err) {
    const e = new Error('Invalid JSON body');
    e.type = 'VALIDATION';
    throw e;
  }
}

function getPathId(event) {
  const pathParams = event.pathParameters || {};
  return pathParams.id;
}

module.exports.handler = async function handler(event) {
  try {
    const method = event.httpMethod;
    const id = getPathId(event);

    // Item routes
    if (method === 'POST' && !id) {
      const payload = parseBody(event);
      const created = await createItem(repository, payload);
      return jsonResponse(201, created);
    }

    if (method === 'GET' && id) {
      const found = await getItem(repository, id);
      return jsonResponse(200, found);
    }

    if (method === 'PUT' && id) {
      const payload = parseBody(event);
      const updated = await updateItem(repository, id, payload);
      return jsonResponse(200, updated);
    }

    if (method === 'DELETE' && id) {
      await deleteItem(repository, id);
      return jsonResponse(204, null);
    }

    // User routes
    const userRepo = createUserRepository();
    if (method === 'POST' && !id && event.path && event.path.startsWith('/users')) {
      const payload = parseBody(event);
      const created = await createUser(userRepo, payload);
      return jsonResponse(201, created);
    }
    if (method === 'GET' && id && event.path && event.path.startsWith('/users')) {
      const found = await getUser(userRepo, id);
      return jsonResponse(200, found);
    }
    if (method === 'PUT' && id && event.path && event.path.startsWith('/users')) {
      const payload = parseBody(event);
      const updated = await updateUser(userRepo, id, payload);
      return jsonResponse(200, updated);
    }
    if (method === 'DELETE' && id && event.path && event.path.startsWith('/users')) {
      await deleteUser(userRepo, id);
      return jsonResponse(204, null);
    }

    return jsonResponse(404, { message: 'Not Found' });
  } catch (err) {
    if (err && err.type === 'VALIDATION') return jsonResponse(400, { message: err.message });
    if (err && err.type === 'NOT_FOUND') return jsonResponse(404, { message: err.message });
    if (err && err.type === 'DB') return jsonResponse(502, { message: 'Database error' });
    console.error(err);
    return jsonResponse(500, { message: 'Internal Server Error' });
  }
};
