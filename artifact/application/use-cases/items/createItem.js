"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createItem;
/**
 * Use-case: createItem (TypeScript)
 * - Pure business logic: validates input and delegates persistence
 * - Receives a repository via dependency injection
 */
async function createItem(repository, data) {
    if (!data || typeof data !== 'object') {
        const e = new Error('Invalid input');
        e.type = 'VALIDATION';
        throw e;
    }
    const { name, description, status } = data;
    if (!name || typeof name !== 'string' || !name.trim()) {
        const e = new Error('`name` is required');
        e.type = 'VALIDATION';
        throw e;
    }
    const toCreate = {
        name: name.trim(),
        description: description || null,
        status: status || null,
    };
    const created = await repository.create(toCreate);
    return created;
}
