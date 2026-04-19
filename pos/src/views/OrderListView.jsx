import React, { useState, useEffect } from 'react';
import { Settings, Archive, Trash2, Search, FileText, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import { ApiClient } from '../utils/api';
import { VIEWS } from '../constants';

const OrderListView = ({ setView, setSelectedOrder }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelectAll = () => {
    if (selectedIds.length === orders.length) setSelectedIds([]);
    else setSelectedIds(orders.map(o => o.id));
  };

  useEffect(() => {
    ApiClient.get('/api/orders')
      .then(data => { if (data) setOrders(data); else setOrders([]); setLoading(false); })
      .catch(err => { console.error("Failed to load orders:", err); setLoading(false); });
  }, []);

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchQuery) || 
    (order.customer || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusStyle = (s) => {
    if (s === 'Paid' || s === 'Prepared') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'preparing') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Management</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders..."
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-64 transition-all" />
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Session</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">Loading orders...</td></tr>}
            {!loading && filteredOrders.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium"><FileText size={32} className="mx-auto mb-2 opacity-30"/>No orders found</td></tr>}
            {filteredOrders.map((order) => (
              <tr key={order.id} 
                className="hover:bg-teal-50/30 transition-colors cursor-pointer"
                onClick={() => { setSelectedOrder(order); setView(VIEWS.ORDER_DETAIL); }}>
                <td className="px-6 py-4 font-mono text-slate-900 font-bold">#{order.id}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{order.session_id}</td>
                <td className="px-6 py-4 text-slate-500">{order.created_at}</td>
                <td className="px-6 py-4 font-extrabold text-slate-900">${order.total_amount}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{order.customer || '—'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusStyle(order.status)}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListView;
