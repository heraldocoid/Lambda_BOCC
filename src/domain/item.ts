/**
 * Domain: Item entity
 * - Pure domain model without external dependencies
 * - Keeps shape and minimal invariants; validation belongs to use-cases
 */
export interface Item {
  id?: number | null;
  name: string;
  description?: string | null;
  status?: string | null;
  createdAt?: Date | null;
}

export class ItemEntity implements Item {
  id?: number | null;
  name: string;
  description?: string | null;
  status?: string | null;
  createdAt?: Date | null;

  constructor({ id = null, name, description = null, status = null, createdAt = null }: Item) {
    this.id = id ?? null;
    this.name = name;
    this.description = description ?? null;
    this.status = status ?? null;
    this.createdAt = createdAt ?? null;
  }
}
