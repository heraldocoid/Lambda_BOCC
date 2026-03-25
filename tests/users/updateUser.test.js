"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Unit tests for `updateUser` use-case. Focuses on behavior and validation.
 */
const updateUser_1 = __importDefault(require("../../src/application/use-cases/users/updateUser"));
describe('updateUser use-case', () => {
    test('updates user fields when valid', async () => {
        const mockRepo = { update: jest.fn().mockResolvedValue({ id: 'u1', name: 'Bob', email: 'b@b.com', createdAt: new Date() }) };
        const result = await (0, updateUser_1.default)(mockRepo, 'u1', { name: 'Bob', email: 'b@b.com' });
        expect(mockRepo.update).toHaveBeenCalledWith('u1', expect.objectContaining({ name: 'Bob', email: 'b@b.com' }));
        expect(result).toHaveProperty('name', 'Bob');
    });
    test('throws validation when no fields', async () => {
        const mockRepo = { update: jest.fn() };
        await expect((0, updateUser_1.default)(mockRepo, 'u1', {})).rejects.toMatchObject({ type: 'VALIDATION' });
    });
});
