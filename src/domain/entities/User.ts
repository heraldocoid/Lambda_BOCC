/**
 * 
 * Entidad de Usuario
 * 
 * @description: Interface defining the User core domain entity
 * @author: Carlos A. Escobar Navarro
 * @created: 2026-03-24
 */
export class User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;

  constructor(id: string, name: string, email: string, createdAt?: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }
}
