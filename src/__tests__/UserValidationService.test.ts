import { UserValidationService } from '../domain/services/UserValidationService';

/**
 * 
 * Pruebas unitarias para la validación de usuarios
 * 
 * @description: Tests for checking User validation logic
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */
describe('UserValidationService', () => {
  it('should return isValid: true for valid user data', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    const result = UserValidationService.validate(user);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return isValid: false if name is missing', () => {
    const user = {
      email: 'john@example.com'
    };
    const result = UserValidationService.validate(user);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El nombre es obligatorio.');
  });

  it('should return isValid: false if name is empty string', () => {
    const user = {
      name: ' ',
      email: 'john@example.com'
    };
    const result = UserValidationService.validate(user);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El nombre es obligatorio.');
  });

  it('should return isValid: false if email is missing', () => {
    const user = {
      name: 'John Doe'
    };
    const result = UserValidationService.validate(user);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Debe proveer un formato de email válido.');
  });

  it('should return isValid: false if email format is invalid', () => {
    const user = {
      name: 'John Doe',
      email: 'invalid-email'
    };
    const result = UserValidationService.validate(user);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Debe proveer un formato de email válido.');
  });
});
