"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteUser;
async function deleteUser(repository, id) {
    if (!id || typeof id !== 'string') {
        const e = new Error('`id` is required');
        e.type = 'VALIDATION';
        throw e;
    }
    const ok = await repository.delete(id);
    if (!ok) {
        const e = new Error('User not found');
        e.type = 'NOT_FOUND';
        throw e;
    }
    return { deleted: true };
}
