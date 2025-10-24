import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, description } = req.body;
      await pool.query(
        'UPDATE items SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      res.status(200).json({ id, name, description });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM items WHERE id = ?', [id]);
      res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}