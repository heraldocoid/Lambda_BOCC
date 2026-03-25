"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/**
 * Lambda HTTP handler (TypeScript)
 * - Thin transport adapter: translates API Gateway events into application
 *   use-case calls. No business logic here.
 */
const createItem_1 = __importDefault(require("../../application/use-cases/items/createItem"));
const getItem_1 = __importDefault(require("../../application/use-cases/items/getItem"));
const updateItem_1 = __importDefault(require("../../application/use-cases/items/updateItem"));
const deleteItem_1 = __importDefault(require("../../application/use-cases/items/deleteItem"));
const itemRepository_1 = __importDefault(require("../../adapters/postgres/itemRepository"));
const createUser_1 = __importDefault(require("../../application/use-cases/users/createUser"));
const getUser_1 = __importDefault(require("../../application/use-cases/users/getUser"));
const updateUser_1 = __importDefault(require("../../application/use-cases/users/updateUser"));
const deleteUser_1 = __importDefault(require("../../application/use-cases/users/deleteUser"));
const userRepository_1 = __importDefault(require("../../adapters/postgres/userRepository"));
const repository = (0, itemRepository_1.default)();
function jsonResponse(statusCode, body) {
    const headers = { 'Content-Type': 'application/json' };
    return {
        statusCode,
        headers,
        body: statusCode === 204 ? '' : JSON.stringify(body),
    };
}
function parseBody(event) {
    if (!event || !event.body)
        return {};
    try {
        return JSON.parse(event.body);
    }
    catch (err) {
        const e = new Error('Invalid JSON body');
        e.type = 'VALIDATION';
        throw e;
    }
}
function getPathId(event) {
    const pathParams = event.pathParameters || {};
    return pathParams.id;
}
const handler = async function handler(event) {
    try {
        const method = event.httpMethod;
        const id = getPathId(event);
        // Item routes
        if (method === 'POST' && !id) {
            const payload = parseBody(event);
            const created = await (0, createItem_1.default)(repository, payload);
            return jsonResponse(201, created);
        }
        if (method === 'GET' && id) {
            const found = await (0, getItem_1.default)(repository, id);
            return jsonResponse(200, found);
        }
        if (method === 'PUT' && id) {
            const payload = parseBody(event);
            const updated = await (0, updateItem_1.default)(repository, id, payload);
            return jsonResponse(200, updated);
        }
        if (method === 'DELETE' && id) {
            await (0, deleteItem_1.default)(repository, id);
            return jsonResponse(204, null);
        }
        // User routes
        const userRepo = (0, userRepository_1.default)();
        if (method === 'POST' && !id && event.path && event.path.startsWith('/users')) {
            const payload = parseBody(event);
            const created = await (0, createUser_1.default)(userRepo, payload);
            return jsonResponse(201, created);
        }
        if (method === 'GET' && id && event.path && event.path.startsWith('/users')) {
            const found = await (0, getUser_1.default)(userRepo, id);
            return jsonResponse(200, found);
        }
        if (method === 'PUT' && id && event.path && event.path.startsWith('/users')) {
            const payload = parseBody(event);
            const updated = await (0, updateUser_1.default)(userRepo, id, payload);
            return jsonResponse(200, updated);
        }
        if (method === 'DELETE' && id && event.path && event.path.startsWith('/users')) {
            await (0, deleteUser_1.default)(userRepo, id);
            return jsonResponse(204, null);
        }
        return jsonResponse(404, { message: 'Not Found' });
    }
    catch (err) {
        if (err && err.type === 'VALIDATION')
            return jsonResponse(400, { message: err.message });
        if (err && err.type === 'NOT_FOUND')
            return jsonResponse(404, { message: err.message });
        if (err && err.type === 'DB')
            return jsonResponse(502, { message: 'Database error' });
        console.error(err);
        return jsonResponse(500, { message: 'Internal Server Error' });
    }
};
exports.handler = handler;
