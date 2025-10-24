import pool from '../../../lib/db';

export default async function handler(req, res) {
  // Add CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('=== FETCHING ITEMS ===');
      console.log('DB_HOST:', process.env.DB_HOST);
      console.log('DB_USER:', process.env.DB_USER);
      console.log('DB_NAME:', process.env.DB_NAME);
      
      const [rows] = await pool.query('SELECT id, name, description FROM items ORDER BY id DESC');
      console.log('✅ Success! Rows fetched:', rows.length);
      console.log('Data:', rows);
      
      return res.status(200).json(rows);
    } catch (error) {
      console.error('❌ DATABASE ERROR:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('SQL State:', error.sqlState);
      
      return res.status(500).json({ 
        error: 'Failed to fetch items', 
        details: error.message,
        code: error.code
      });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const { name, description } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }
      
      console.log('=== INSERTING ITEM ===');
      console.log('Data:', { name, description });
      
      const [result] = await pool.query(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        [name, description]
      );
      
      console.log('✅ Insert success! ID:', result.insertId);
      
      return res.status(201).json({ 
        id: result.insertId, 
        name, 
        description 
      });
    } catch (error) {
      console.error('❌ DATABASE ERROR:', error);
      return res.status(500).json({ 
        error: 'Failed to create item', 
        details: error.message 
      });
    }
  } 
  
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}