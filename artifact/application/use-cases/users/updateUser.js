"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateUser;
async function updateUser(repository, id, data) {
    if (!id || typeof id !== 'string') {
        const e = new Error('`id` is required');
        e.type = 'VALIDATION';
        throw e;
    }
    if (!data || typeof data !== 'object') {
        const e = new Error('Invalid input');
        e.type = 'VALIDATION';
        throw e;
    }
    const fields = {};
    if (Object.prototype.hasOwnProperty.call(data, 'name')) {
        if (!data.name || typeof data.name !== 'string') {
            const e = new Error('`name` must be a non-empty string');
            e.type = 'VALIDATION';
            throw e;
        }
        fields.name = data.name.trim();
    }
    if (Object.prototype.hasOwnProperty.call(data, 'email')) {
        if (!data.email || typeof data.email !== 'string') {
            const e = new Error('`email` must be a non-empty string');
            e.type = 'VALIDATION';
            throw e;
        }
        fields.email = data.email.trim();
    }
    if (Object.keys(fields).length === 0) {
        const e = new Error('No fields to update');
        e.type = 'VALIDATION';
        throw e;
    }
    const updated = await repository.update(id, fields);
    if (!updated) {
        const e = new Error('User not found');
        e.type = 'NOT_FOUND';
        throw e;
    }
    return updated;
}
