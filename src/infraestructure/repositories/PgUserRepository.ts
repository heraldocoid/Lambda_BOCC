import pool from '../db/pool';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class PgUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const result = await pool().query('SELECT * FROM users');
    return result.rows;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool().query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async create(user: User): Promise<User> {
    const result = await pool().query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *',
      [user.id, user.name, user.email]
    );
    return result.rows[0];
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const result = await pool().query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING *',
      [user.name, user.email, id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool().query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
