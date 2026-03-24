import { User } from '../entities/User';

/**
 * 
 * Interfaz de repositorio para usuarios
 * 
 * @description: Core repository interface for User data access
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
