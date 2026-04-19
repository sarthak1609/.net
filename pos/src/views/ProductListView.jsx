import React, { useState, useEffect } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';
import { ApiClient } from '../utils/api';

const ProductListView = ({ setView, setSelectedProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    ApiClient.get('/api/items')
      .then(data => { setProducts(data || []); setLoading(false); })
      .catch(err => { console.error("Failed to load products:", err); setLoading(false); });
  }, []);

  const filtered = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const catColor = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('coffee') || c.includes('drink')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (c.includes('bakery') || c.includes('bread')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (c.includes('pastry') || c.includes('cake')) return 'bg-pink-50 text-pink-700 border-pink-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Catalog</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Products</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-64 transition-all"/>
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400"/>
          </div>
          <Button onClick={() => { setSelectedProduct(null); setView(VIEWS.PRODUCT_DETAIL); }}><Plus size={16} /> New</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-xs border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium"><Package size={32} className="mx-auto mb-2 opacity-30"/>No products found</td></tr>}
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-teal-50/30 transition-colors cursor-pointer"
                onClick={() => { setSelectedProduct(product); setView(VIEWS.PRODUCT_DETAIL); }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold text-xs border border-teal-100">{(product.name || '?').substring(0,2).toUpperCase()}</div>
                    <span className="font-bold text-slate-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs truncate max-w-[200px]">{product.description || '—'}</td>
                <td className="px-6 py-4 font-extrabold text-slate-900">${Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${catColor(product.category)}`}>{product.category || '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListView;
