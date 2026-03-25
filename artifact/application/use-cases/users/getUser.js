"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getUser;
async function getUser(repository, id) {
    if (!id || typeof id !== 'string') {
        const e = new Error('`id` is required');
        e.type = 'VALIDATION';
        throw e;
    }
    const user = await repository.findById(id);
    if (!user) {
        const e = new Error('User not found');
        e.type = 'NOT_FOUND';
        throw e;
    }
    return user;
}
