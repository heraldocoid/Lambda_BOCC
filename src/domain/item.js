/**
 * Domain model: Item
 * This file only defines the shape of the domain entity and contains no
 * infrastructure or business logic. Validations live in use-cases.
 */
class Item {
  constructor({ id = null, name, description = null, status = null, created_at = null } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created_at = created_at;
  }
}

module.exports = Item;
