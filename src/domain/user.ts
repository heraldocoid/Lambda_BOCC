/**
 * Domain: User entity
 * - Pure domain model, no external dependencies
 * - Keeps only the shape and basic invariants (thin)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date | undefined;

  constructor({ id, name, email, createdAt }: User) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }
}
