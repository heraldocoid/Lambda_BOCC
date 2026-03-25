"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Unit tests for `getUser` use-case. Mocks repository port; validates behavior.
 */
const getUser_1 = __importDefault(require("../../src/application/use-cases/users/getUser"));
describe('getUser use-case', () => {
    test('returns user when found', async () => {
        const mockRepo = { findById: jest.fn().mockResolvedValue({ id: 'u1', name: 'Alice', email: 'a@b.com', createdAt: new Date() }) };
        const result = await (0, getUser_1.default)(mockRepo, 'u1');
        expect(mockRepo.findById).toHaveBeenCalledWith('u1');
        expect(result).toHaveProperty('id', 'u1');
    });
    test('throws NOT_FOUND when missing', async () => {
        const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
        await expect((0, getUser_1.default)(mockRepo, 'uX')).rejects.toMatchObject({ type: 'NOT_FOUND' });
    });
});
