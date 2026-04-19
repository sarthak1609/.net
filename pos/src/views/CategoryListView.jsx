import React, { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, Palette } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';
import { ApiClient } from '../utils/api';

const CategoryListView = ({ setView }) => {
  const [categories, setCategories] = useState([]);
  const [newRowVisible, setNewRowVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    ApiClient.get('/api/category')
      .then(data => { if (Array.isArray(data)) setCategories(data); else setCategories([]); setLoading(false); })
      .catch(err => { console.error("Failed to load categories:", err); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!newCategoryName.trim()) { alert("Name is required!"); return; }
    setIsSaving(true);
    try {
      const response = await ApiClient.post('/api/category', { name: newCategoryName });
      if (response) {
        const newCategory = response.category || { id: Date.now(), c_name: newCategoryName, color: 'bg-slate-400' };
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setNewRowVisible(false);
      }
    } catch (error) { console.error("Save error:", error); alert("Error: " + error.message); }
    finally { setIsSaving(false); }
  };

  const colors = ['bg-slate-400', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500', 'bg-blue-500', 'bg-teal-500'];
  const updateColor = (id, color) => setCategories(categories.map(c => c.id === id ? { ...c, color } : c));
  const handleDelete = (id) => setCategories(categories.filter(c => c.id !== id));

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Catalog</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Categories</h1>
        </div>
        <Button onClick={() => setNewRowVisible(true)}><Plus size={16} /> New Category</Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-xs border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-10"></th>
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4">Color</th>
              <th className="px-4 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">Loading...</td></tr>}
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-teal-50/20 transition-colors group">
                <td className="px-4 py-4 text-center cursor-move text-slate-300 hover:text-slate-500"><GripVertical size={16} /></td>
                <td className="px-6 py-4">
                  <input type="text" defaultValue={cat.c_name} className="bg-transparent outline-none text-slate-900 font-bold w-full"/>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button key={c} onClick={() => updateColor(cat.id, c)}
                        className={`w-5 h-5 rounded-full ${c} ${cat.color === c ? 'ring-2 ring-teal-600 ring-offset-2' : 'opacity-40 hover:opacity-100'} transition-all`}/>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <button onClick={() => handleDelete(cat.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {newRowVisible && (
              <tr className="bg-teal-50/30 animate-fadeIn">
                <td className="px-4 py-4 text-center text-slate-300"><GripVertical size={16} /></td>
                <td className="px-6 py-4">
                  <input type="text" autoFocus placeholder="Type name and press Enter..." value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="bg-transparent border-b-2 border-teal-500 outline-none text-slate-900 font-bold w-full" disabled={isSaving}/>
                </td>
                <td className="px-6 py-4"><span className="text-xs text-slate-400 font-medium">Default</span></td>
                <td className="px-4 py-4"><button onClick={() => setNewRowVisible(false)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryListView;
