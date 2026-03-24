/**
 * Postgres adapter for User repository (TypeScript)
 * - Implements the repository port used by application use-cases
 * - Maps DB rows to plain objects compatible with `User`
 */
const pg = require('./postgresClient');

async function create(user: any) {
  const text = `INSERT INTO users (id, name, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at`;
  const values = [user.id, user.name, user.email];
  try {
    const res = await pg.query(text, values);
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
    };
  } catch (err) {
    const e: any = new Error('DB error creating user');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

async function findById(id: string) {
  try {
    const res = await pg.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    const row = res.rows[0];
    if (!row) return null;
    return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at };
  } catch (err) {
    const e: any = new Error('DB error finding user');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

async function update(id: string, fields: any) {
  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (fields.name !== undefined) { sets.push(`name = $${idx++}`); values.push(fields.name); }
  if (fields.email !== undefined) { sets.push(`email = $${idx++}`); values.push(fields.email); }

  if (sets.length === 0) return findById(id);

  values.push(id);
  const text = `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id, name, email, created_at`;
  try {
    const res = await pg.query(text, values);
    const row = res.rows[0];
    if (!row) return null;
    return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at };
  } catch (err) {
    const e: any = new Error('DB error updating user');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

async function remove(id: string) {
  try {
    const res = await pg.query('DELETE FROM users WHERE id = $1', [id]);
    return res.rowCount > 0;
  } catch (err) {
    const e: any = new Error('DB error deleting user');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

module.exports = function createUserRepository() {
  return {
    create,
    findById,
    update,
    delete: remove,
  };
};
