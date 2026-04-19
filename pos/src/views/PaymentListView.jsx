import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CreditCard, Wallet, Banknote } from 'lucide-react';

const PaymentListView = ({ setView }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/payments')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPayments(data); else setPayments([]); setLoading(false); })
      .catch(err => { console.error("Failed to load payments:", err); setLoading(false); });
  }, []);

  const groupedPayments = payments.reduce((groups, payment) => {
    const method = payment.payment_method || 'Other';
    if (!groups[method]) groups[method] = { total: 0, items: [] };
    groups[method].items.push(payment);
    groups[method].total += parseFloat(payment.total_amount || 0);
    return groups;
  }, {});

  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    setExpandedGroups(Object.keys(groupedPayments).reduce((acc, key) => ({...acc, [key]: true}), {}));
  }, [payments]);

  const toggleGroup = (method) => setExpandedGroups(prev => ({...prev, [method]: !prev[method]}));

  const methodIcon = (m) => {
    if (m.toLowerCase().includes('card')) return <CreditCard size={16} className="text-blue-500"/>;
    if (m.toLowerCase().includes('cash')) return <Banknote size={16} className="text-emerald-500"/>;
    return <Wallet size={16} className="text-teal-500"/>;
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Finance</p>
        <h1 className="text-3xl font-extrabold text-slate-900">Payments</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-slate-50 text-slate-400 text-xs uppercase font-bold border-b border-slate-200 px-6 py-4 tracking-wider">
          <div className="col-span-5">Payment Method</div>
          <div className="col-span-4">Date</div>
          <div className="col-span-3 text-right">Amount</div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400 font-medium">Loading payments...</div>
        ) : Object.keys(groupedPayments).length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 font-medium">No payments found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {Object.entries(groupedPayments).map(([method, data]) => (
              <div key={method}>
                <div className="bg-slate-50/50 hover:bg-slate-50 px-6 py-4 flex items-center justify-between cursor-pointer select-none transition-colors" onClick={() => toggleGroup(method)}>
                  <div className="flex items-center gap-3 font-extrabold text-slate-900">
                    {expandedGroups[method] ? <ChevronDown size={16} className="text-slate-400"/> : <ChevronRight size={16} className="text-slate-400"/>}
                    {methodIcon(method)}
                    <span className="capitalize">{method}</span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-1">{data.items.length}</span>
                  </div>
                  <div className="font-extrabold text-teal-600">${data.total.toFixed(2)}</div>
                </div>
                {expandedGroups[method] && (
                  <div className="bg-white">
                    {data.items.map(payment => (
                      <div key={payment.id} className="grid grid-cols-12 px-6 py-3.5 text-sm hover:bg-teal-50/30 border-t border-slate-50 transition-colors">
                        <div className="col-span-5 pl-10 flex items-center gap-2 text-slate-600 font-medium">
                          <span className="text-slate-400 text-xs font-mono">#{payment.id}</span>
                        </div>
                        <div className="col-span-4 text-slate-400 font-medium">{payment.created_at}</div>
                        <div className="col-span-3 text-right font-bold text-slate-900">${payment.total_amount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentListView;
