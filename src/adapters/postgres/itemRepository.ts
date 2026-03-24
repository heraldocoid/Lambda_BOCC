import { query } from './postgresClient';

/**
 * Postgres adapter: item repository (TypeScript)
 * - Implements repository port used by application use-cases
 */
async function createItem(item: any) {
  const text = `INSERT INTO items (name, description, status, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING id, name, description, status, created_at`;
  const values = [item.name, item.description, item.status];
  try {
    const res = await query(text, values);
    return res.rows[0];
  } catch (err: any) {
    const e: any = new Error('Error creating item');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

async function findById(id: number) {
  try {
    const res = await query('SELECT id, name, description, status, created_at FROM items WHERE id = $1', [id]);
    return res.rows[0] || null;
  } catch (err: any) {
    const e: any = new Error('Error finding item by id');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

async function updateItem(id: number, fields: any) {
  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (fields.name !== undefined) { sets.push(`name = $${idx++}`); values.push(fields.name); }
  if (fields.description !== undefined) { sets.push(`description = $${idx++}`); values.push(fields.description); }
  if (fields.status !== undefined) { sets.push(`status = $${idx++}`); values.push(fields.status); }

  if (sets.length === 0) {
    return findById(id);
  }

  values.push(id);
  const text = `UPDATE items SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id, name, description, status, created_at`;
  try {
    const res = await query(text, values);
    return res.rows[0] || null;
  } catch (err: any) {
    const e: any = new Error('Error updating item');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

async function deleteItem(id: number) {
  try {
    const res = await query('DELETE FROM items WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  } catch (err: any) {
    const e: any = new Error('Error deleting item');
    e.type = 'DB';
    e.original = err;
    throw e;
  }
}

export default function createItemRepository() {
  return {
    create: createItem,
    findById,
    update: updateItem,
    delete: deleteItem,
  };
}
