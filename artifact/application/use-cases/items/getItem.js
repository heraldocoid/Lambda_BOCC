"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getItem;
async function getItem(repository, id) {
    if (!id) {
        const e = new Error('`id` is required');
        e.type = 'VALIDATION';
        throw e;
    }
    const parsed = parseInt(String(id), 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        const e = new Error('Invalid `id`');
        e.type = 'VALIDATION';
        throw e;
    }
    const item = await repository.findById(parsed);
    if (!item) {
        const e = new Error('Item not found');
        e.type = 'NOT_FOUND';
        throw e;
    }
    return item;
}
