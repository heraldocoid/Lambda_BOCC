/**
 * Infrastructure repository: itemRepository
 * Encapsulates all SQL and Postgres specifics; returns plain objects.
 */
const pg = require('./postgresClient');

async function create(item) {
  const text = `INSERT INTO items (name, description, status, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING id, name, description, status, created_at`;
  const values = [item.name, item.description, item.status];
  const res = await pg.query(text, values);
  return res.rows[0];
}

async function findById(id) {
  const res = await pg.query('SELECT id, name, description, status, created_at FROM items WHERE id = $1', [id]);
  return res.rows[0] || null;
}

async function update(id, fields) {
  const sets = [];
  const values = [];
  let idx = 1;
  if (fields.name !== undefined) { sets.push(`name = $${idx++}`); values.push(fields.name); }
  if (fields.description !== undefined) { sets.push(`description = $${idx++}`); values.push(fields.description); }
  if (fields.status !== undefined) { sets.push(`status = $${idx++}`); values.push(fields.status); }

  if (sets.length === 0) {
    return findById(id);
  }

  values.push(id);
  const text = `UPDATE items SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING id, name, description, status, created_at`;
  const res = await pg.query(text, values);
  return res.rows[0] || null;
}

async function remove(id) {
  const res = await pg.query('DELETE FROM items WHERE id = $1', [id]);
  return res.rowCount > 0;
}

module.exports = function createItemRepository() {
  return {
    create,
    findById,
    update,
    delete: remove,
  };
};
