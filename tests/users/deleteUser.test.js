"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Unit tests for `deleteUser` use-case. Repository is mocked to avoid DB.
 */
const deleteUser_1 = __importDefault(require("../../src/application/use-cases/users/deleteUser"));
describe('deleteUser use-case', () => {
    test('deletes when exists', async () => {
        const mockRepo = { delete: jest.fn().mockResolvedValue(true) };
        const res = await (0, deleteUser_1.default)(mockRepo, 'u1');
        expect(mockRepo.delete).toHaveBeenCalledWith('u1');
        expect(res).toEqual({ deleted: true });
    });
    test('throws NOT_FOUND when missing', async () => {
        const mockRepo = { delete: jest.fn().mockResolvedValue(false) };
        await expect((0, deleteUser_1.default)(mockRepo, 'uX')).rejects.toMatchObject({ type: 'NOT_FOUND' });
    });
});
