import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserValidationService } from '../../domain/services/UserValidationService';

/**
 * 
 * Clase de servicio para la gestión de usuarios
 * 
 * @description: Application service layer for User management
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async createUser(userData: Partial<User>): Promise<{ success: boolean; data?: User; errors?: string[] }> {
    const validation = UserValidationService.validate(userData);

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const userToCreate: User = {
      id: userData.id || this.generateId(),
      name: userData.name!,
      email: userData.email!,
    };

    const createdUser = await this.userRepository.create(userToCreate);
    return { success: true, data: createdUser };
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; data?: User; errors?: string[] }> {
    if (!id) {
      return { success: false, errors: ['El ID del usuario es requerido para actualizar'] };
    }

    const updatedUser = await this.userRepository.update(id, userData);
    
    if (!updatedUser) {
      return { success: false, errors: ['Usuario no encontrado o no se pudo actualizar'] };
    }

    return { success: true, data: updatedUser };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  private generateId(): string {
    return randomUUID();
  }
}
