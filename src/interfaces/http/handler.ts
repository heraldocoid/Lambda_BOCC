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

// Repositories (outer adapters)
const itemRepository = createItemRepository();
const userRepository = createUserRepository();

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

// NOTE: routing intentionally uses ONLY query params to simplify API Gateway
export const handler = async function handler(event: any) {
  try {
    const method = event.httpMethod;

    // Read entity and id from query params only (no path or pathParameters)
    const qs = event?.queryStringParameters || {};
    const entity = String(qs.entity || 'items').toLowerCase(); // items | users
    const id = qs.id;

    // Diagnostic logging (do not print secrets or full body)
    console.log('[request]', {
      requestId: event?.requestContext?.requestId,
      method: event?.httpMethod,
      path: event?.path,
      entity,
      id,
      hasBody: Boolean(event?.body),
      bodyLength: event?.body ? String(event.body).length : 0,
    });

    // Helper: require id for GET/PUT/DELETE
    const requireId = () => {
      if (!id) {
        const e: any = new Error('`id` is required');
        e.type = 'VALIDATION';
        throw e;
      }
    };

    // ROUTING: only based on httpMethod, presence of id, and entity
    if (entity === 'items') {
      if (method === 'POST' && !id) {
        const payload = parseBody(event);
        const created = await createItem(itemRepository, payload);
        return jsonResponse(201, created);
      }

      if (method === 'GET') {
        requireId();
        const found = await getItem(itemRepository, id);
        return jsonResponse(200, found);
      }

      if (method === 'PUT') {
        requireId();
        const payload = parseBody(event);
        const updated = await updateItem(itemRepository, id, payload);
        return jsonResponse(200, updated);
      }

      if (method === 'DELETE') {
        requireId();
        await deleteItem(itemRepository, id);
        return jsonResponse(204, null);
      }
    }

    if (entity === 'users') {
      if (method === 'POST' && !id) {
        const payload = parseBody(event);
        const created = await createUser(userRepository, payload);
        return jsonResponse(201, created);
      }

      if (method === 'GET') {
        requireId();
        const found = await getUser(userRepository, id);
        return jsonResponse(200, found);
      }

      if (method === 'PUT') {
        requireId();
        const payload = parseBody(event);
        const updated = await updateUser(userRepository, id, payload);
        return jsonResponse(200, updated);
      }

      if (method === 'DELETE') {
        requireId();
        await deleteUser(userRepository, id);
        return jsonResponse(204, null);
      }
    }

    // If no route matched, return Not Found
    return jsonResponse(404, { message: 'Not Found' });
  } catch (err: any) {
    // Diagnostic error logging (avoid printing stacks or secrets)
    console.error('[error]', {
      requestId: event?.requestContext?.requestId,
      type: err?.type,
      message: err?.message,
      originalMessage: err?.original?.message,
    });

    // Error mapping
    if (err && err.type === 'VALIDATION') return jsonResponse(400, { message: err.message });
    if (err && err.type === 'NOT_FOUND') return jsonResponse(404, { message: err.message });
    if (err && err.type === 'DB') return jsonResponse(502, { message: 'Database error' });
    return jsonResponse(500, { message: 'Internal Server Error' });
  }
};
