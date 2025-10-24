import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

export default function CRUDApp() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      
      console.log('Fetched data:', data);
      console.log('Is array?', Array.isArray(data));
      
      // Check if response is an error object
      if (data.error) {
        setError(data.error + (data.details ? ': ' + data.details : ''));
        setItems([]);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else {
        setError('Unexpected response format');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to fetch items: ' + error.message);
      setItems([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) return;
    
    setLoading(true);
    setError('');

    try {
      const url = editingId ? `/api/items/${editingId}` : '/api/items';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setName('');
        setDescription('');
        setEditingId(null);
        fetchItems();
      }
    } catch (error) {
      console.error('Error saving item:', error);
      setError('Failed to save item: ' + error.message);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item: ' + error.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Next.js MySQL CRUD</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter item name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Enter item description"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading || !name || !description}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {editingId ? 'Update' : 'Add'} Item
              </button>
              
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Items List</h2>
          
          {loading && items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : !Array.isArray(items) || items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items yet. Add one above!</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      {item.created_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(item.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}