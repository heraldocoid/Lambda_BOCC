import { User } from '../entities/User';

/**
 * 
 * Clase de servicio de validación de usuarios
 * 
 * @description: Core domain logic for validating User data
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */

export class UserValidationService {
  static validate(user: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!user.name || user.name.trim().length === 0) {
      errors.push("El nombre es obligatorio.");
    }

    if (!user.email || !this.isValidEmail(user.email)) {
      errors.push("Debe proveer un formato de email válido.");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regex.test(email);
  }
}
