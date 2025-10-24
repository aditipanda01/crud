import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching items from database...');
      const [rows] = await pool.query('SELECT * FROM items ORDER BY id DESC');
      console.log('Rows fetched:', rows);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch items', details: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      
      console.log('Inserting item:', { name, description });
      const [result] = await pool.query(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        [name, description]
      );
      console.log('Insert result:', result);
      
      res.status(201).json({ 
        id: result.insertId, 
        name, 
        description 
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create item', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}