import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, DollarSign, Tag, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';
import { ApiClient } from '../utils/api';

const ProductDetailView = ({ product, setView }) => {
  const [category, setCategory] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState(product || {
    name: '', description: '', category: 'Quick Bites', price: '',
  });

  useEffect(() => {
    ApiClient.get('/api/category')
      .then(data => { setCategory(data || []); setLoading(false); })
      .catch(err => { console.error("Failed to load categories:", err); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.price) { alert("Name and Price are required!"); return; }
    setIsSaving(true);
    try {
      const response = await ApiClient.post('/api/products', { name: formData.name, description: formData.description, price: parseFloat(formData.price), category: formData.category });
      if (response) { alert("Product saved!"); setView(VIEWS.PRODUCT_LIST); }
    } catch (error) { console.error("Save error:", error); alert("Error: " + error.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(VIEWS.PRODUCT_LIST)} className="text-slate-400 hover:text-teal-600 p-2 hover:bg-teal-50 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-200">{product ? 'Edit' : 'New'}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Product</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setView(VIEWS.PRODUCT_LIST)}>Discard</Button>
          <Button onClick={handleSave} disabled={isSaving}><Save size={16}/> {isSaving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Product Name */}
        <div className="p-8 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Product Name</label>
          <input type="text" placeholder="e.g. Cheese Burger" 
            className="w-full bg-transparent border-b-2 border-slate-200 text-2xl font-black text-slate-900 placeholder:text-slate-300 focus:border-teal-500 outline-none pb-2 transition-colors"
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-8 bg-slate-50 border-b border-slate-200">
          <button onClick={() => setActiveTab('general')}
            className={`py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'general' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >General Info</button>
        </div>

        {/* Form */}
        {activeTab === 'general' && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><Tag size={12}/> Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none transition-all"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  {(category || []).map((cat) => (<option key={cat.id} value={cat.c_name}>{cat.c_name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><FileText size={12}/> Description</label>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none h-28 resize-none transition-all"
                  placeholder="e.g. Juicy beef burger with cheese..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><DollarSign size={12}/> Sale Price</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl text-slate-300 font-bold">$</span>
                  <input type="number" placeholder="0.00" 
                    className="bg-transparent text-center text-4xl font-black text-slate-900 outline-none w-40"
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">Price per unit</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailView;
