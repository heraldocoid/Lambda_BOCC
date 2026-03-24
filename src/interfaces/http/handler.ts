/**
 * Lambda HTTP handler (TypeScript)
 * - Thin transport adapter: translates API Gateway events into application
 *   use-case calls. No business logic here.
 */
import createItem from '../../application/use-cases/items/createItem';
import getItem from '../../application/use-cases/items/getItem';
import updateItem from '../../application/use-cases/items/updateItem';
import deleteItem from '../../application/use-cases/items/deleteItem';
import createItemRepository from '../../adapters/postgres/itemRepository';

import createUser from '../../application/use-cases/users/createUser';
import getUser from '../../application/use-cases/users/getUser';
import updateUser from '../../application/use-cases/users/updateUser';
import deleteUser from '../../application/use-cases/users/deleteUser';
import createUserRepository from '../../adapters/postgres/userRepository';

const repository = createItemRepository();

function jsonResponse(statusCode: number, body: any) {
  const headers = { 'Content-Type': 'application/json' };
  return {
    statusCode,
    headers,
    body: statusCode === 204 ? '' : JSON.stringify(body),
  };
}

function parseBody(event: any) {
  if (!event || !event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (err: any) {
    const e: any = new Error('Invalid JSON body');
    e.type = 'VALIDATION';
    throw e;
  }
}

function getPathId(event: any) {
  const pathParams = event.pathParameters || {};
  return pathParams.id;
}

export const handler = async function handler(event: any) {
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
  } catch (err: any) {
    if (err && err.type === 'VALIDATION') return jsonResponse(400, { message: err.message });
    if (err && err.type === 'NOT_FOUND') return jsonResponse(404, { message: err.message });
    if (err && err.type === 'DB') return jsonResponse(502, { message: 'Database error' });
    console.error(err);
    return jsonResponse(500, { message: 'Internal Server Error' });
  }
};
