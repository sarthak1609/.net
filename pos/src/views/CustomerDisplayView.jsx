import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Check, Coffee, Home } from 'lucide-react';
import { VIEWS } from '../constants';

const CustomerDisplayView = ({ setView }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        const data = await response.json();
        if (Array.isArray(data)) {
          const formatted = data.map(order => ({
            id: order.id,
            orderNo: order.id.toString(),
            status: order.status === 'Prepared' ? 'Ready' : 'Preparing',
            table: order.session_id ? `S-${order.session_id}` : 'Walk-in'
          }));
          setOrders(formatted);
        }
      } catch (err) { console.error("Failed to load customer display data:", err); }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const readyOrders = orders.filter(o => o.status === 'Ready').slice(0, 8);
  const preparingOrders = orders.filter(o => o.status === 'Preparing').slice(0, 8);

  return (
    <div className="h-screen bg-transparent flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 h-24 flex items-center justify-between px-10 shadow-sm relative z-10">
        <div className="flex items-center gap-5">
            <button onClick={() => setView(VIEWS.DASHBOARD)} className="text-slate-400 hover:text-teal-600 p-3 hover:bg-teal-50 rounded-2xl transition-all">
                <Home size={28} />
            </button>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-600/20">51</div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Status</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Please wait for your number</p>
                </div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-3xl font-black text-teal-600 tabular-nums">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Local Time</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex p-10 gap-10">
        
        {/* Preparing Column */}
        <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Clock size={20} strokeWidth={2.5}/></div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Preparing</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {preparingOrders.map(order => (
                    <div key={order.id} className="bg-white border-2 border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm animate-fadeIn">
                        <span className="text-5xl font-black text-slate-900 mb-2">#{order.orderNo}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{order.table}</span>
                    </div>
                ))}
                {preparingOrders.length === 0 && (
                    <div className="col-span-2 py-20 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300">
                        <Coffee size={48} className="mb-4 opacity-20" />
                        <span className="text-sm font-bold uppercase tracking-widest">No active orders</span>
                    </div>
                )}
            </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-slate-200 h-full"></div>

        {/* Ready Column */}
        <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Check size={20} strokeWidth={3}/></div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Ready for Pickup</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {readyOrders.map(order => (
                    <div key={order.id} className="bg-emerald-500 border-4 border-emerald-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/20 animate-pulse transition-all">
                        <span className="text-6xl font-black text-white mb-2">#{order.orderNo}</span>
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-white">
                            <ShoppingBag size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Collect Now</span>
                        </div>
                    </div>
                ))}
                {readyOrders.length === 0 && (
                    <div className="col-span-2 py-20 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300">
                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                        <span className="text-sm font-bold uppercase tracking-widest">Waiting for orders</span>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Footer / Scrolling Ticker */}
      <div className="h-16 bg-slate-900 flex items-center px-10 relative overflow-hidden">
          <div className="flex gap-10 animate-fadeIn whitespace-nowrap">
              <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  STAY SAFE • PLEASE WEAR A MASK • ENJOY YOUR COFFEE • 51CAFE
              </span>
          </div>
      </div>
    </div>
  );
};

export default CustomerDisplayView;
