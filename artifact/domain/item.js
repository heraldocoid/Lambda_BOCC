"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemEntity = void 0;
class ItemEntity {
    constructor({ id = null, name, description = null, status = null, createdAt = null }) {
        this.id = id !== null && id !== void 0 ? id : null;
        this.name = name;
        this.description = description !== null && description !== void 0 ? description : null;
        this.status = status !== null && status !== void 0 ? status : null;
        this.createdAt = createdAt !== null && createdAt !== void 0 ? createdAt : null;
    }
}
exports.ItemEntity = ItemEntity;
