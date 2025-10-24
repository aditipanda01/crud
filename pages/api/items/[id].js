import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, description } = req.body;
      
      console.log('=== UPDATING ITEM ===');
      console.log('ID:', id);
      console.log('Data:', { name, description });
      
      await pool.query(
        'UPDATE items SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      
      console.log('✅ Update success!');
      
      return res.status(200).json({ id, name, description });
    } catch (error) {
      console.error('❌ DATABASE ERROR:', error);
      return res.status(500).json({ 
        error: 'Failed to update item', 
        details: error.message 
      });
    }
  } 
  
  else if (req.method === 'DELETE') {
    try {
      console.log('=== DELETING ITEM ===');
      console.log('ID:', id);
      
      await pool.query('DELETE FROM items WHERE id = ?', [id]);
      
      console.log('✅ Delete success!');
      
      return res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
      console.error('❌ DATABASE ERROR:', error);
      return res.status(500).json({ 
        error: 'Failed to delete item', 
        details: error.message 
      });
    }
  } 
  
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}