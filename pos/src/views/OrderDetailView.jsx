import React from 'react';
import { ChevronRight, Package, Calendar, User, Hash } from 'lucide-react';
import { VIEWS, MOCK_ORDER_LINES } from '../constants';

const OrderDetailView = ({ order, setView }) => {
  if (!order) return null;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-6">
        <span className="hover:text-teal-600 cursor-pointer transition-colors" onClick={() => setView(VIEWS.ORDER_LIST)}>Orders</span>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-bold">#{order.id || order.orderNo}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Order #{order.id || order.orderNo}</h1>
              <p className="text-slate-400 font-medium">{order.created_at || order.date}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
              order.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>{order.status}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3"><Hash size={18} className="text-slate-400"/><div><p className="text-xs font-bold text-slate-400 uppercase">Order ID</p><p className="text-slate-900 font-bold">{order.id || order.orderNo}</p></div></div>
            <div className="flex items-center gap-3"><User size={18} className="text-slate-400"/><div><p className="text-xs font-bold text-slate-400 uppercase">Customer</p><p className="text-teal-600 font-bold">{order.customer || '—'}</p></div></div>
            <div className="flex items-center gap-3"><Calendar size={18} className="text-slate-400"/><div><p className="text-xs font-bold text-slate-400 uppercase">Date</p><p className="text-slate-900 font-medium">{order.created_at || order.date}</p></div></div>
            <div className="flex items-center gap-3"><Package size={18} className="text-slate-400"/><div><p className="text-xs font-bold text-slate-400 uppercase">Session</p><p className="text-slate-900 font-medium">{order.session_id || order.session}</p></div></div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <span className="text-sm font-extrabold text-teal-600 border-b-2 border-teal-600 pb-1">Products</span>
          <span className="text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-600 pb-1">Details</span>
        </div>
        <div className="p-8">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 font-bold uppercase text-xs border-b-2 border-slate-100">
              <tr>
                <th className="py-3">Product</th><th className="py-3">Qty</th><th className="py-3 text-right">Price</th>
                <th className="py-3 text-center">Tax</th><th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_ORDER_LINES.map(line => (
                <tr key={line.id} className="hover:bg-teal-50/20 transition-colors">
                  <td className="py-4 text-teal-600 font-bold">{line.product}</td>
                  <td className="py-4 text-slate-600 font-medium">{line.qty}</td>
                  <td className="py-4 text-right text-slate-600">${line.amount}</td>
                  <td className="py-4 text-center text-slate-400 text-xs">{line.tax}</td>
                  <td className="py-4 text-right font-extrabold text-slate-900">${line.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-slate-400 text-sm font-medium"><span>Untaxed</span><span>$375.00</span></div>
              <div className="flex justify-between text-slate-400 text-sm font-medium"><span>Tax</span><span>$18.75</span></div>
              <div className="flex justify-between text-slate-900 font-black text-xl pt-3 border-t border-slate-200"><span>Total</span><span className="text-teal-600">$393.75</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
