import React, { useState, useEffect } from 'react';
import { Mail, Plus, Users, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';

const CustomerListView = ({ setView, setSelectedCustomer }) => {
  const [formData, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/user')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUser(data); else setUser([]); setLoading(false); })
      .catch(err => { console.error("Failed to load user:", err); setLoading(false); });
  }, []);

  const filtered = formData.filter(c => 
    (c.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Management</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Customers</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-56 transition-all"/>
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400"/>
          </div>
          <Button onClick={() => { setSelectedCustomer(null); setView(VIEWS.CUSTOMER_DETAIL); }}><Plus size={16} /> New</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-xs border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400 font-medium"><Users size={32} className="mx-auto mb-2 opacity-30"/>No customers found</td></tr>}
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-teal-50/30 transition-colors cursor-pointer"
                onClick={() => { setSelectedCustomer(customer); setView(VIEWS.CUSTOMER_DETAIL); }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm border border-teal-100">{(customer.username || '?')[0].toUpperCase()}</div>
                    <span className="font-bold text-slate-900">{customer.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="flex items-center gap-2 text-teal-600 font-medium"><Mail size={14} /> {customer.email}</div></td>
                <td className="px-6 py-4 font-mono text-slate-500 text-xs font-bold">{customer.user_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerListView;
