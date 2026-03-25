"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor({ id, name, email, createdAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
    }
}
exports.UserEntity = UserEntity;
/**
 * Note: domain types are intentionally minimal — all validation lives in
 * the application/use-cases layer. This keeps the domain pure and focused
 * on the business concepts, not on transport or persistence concerns.
 */
