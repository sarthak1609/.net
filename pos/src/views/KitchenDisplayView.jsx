import React, { useState, useEffect } from 'react';
import { Search, Home, ChefHat, Clock, Check, Flame, X } from 'lucide-react';
import { VIEWS } from '../constants';

const KitchenDisplayView = ({ setView, userName }) => {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState([]);
  const [activeStage, setActiveStage] = useState('To Cook');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarFilter, setSidebarFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await fetch('http://localhost:5000/api/category');
        const catData = await catResponse.json();
        if (Array.isArray(catData)) setCategories(catData.map(c => ({ ...c, name: c.c_name })));

        const productResponse = await fetch('http://localhost:5000/api/items');
        const pData = await productResponse.json();
        if (Array.isArray(pData)) setProductData(pData);

        const orderResponse = await fetch('http://localhost:5000/api/orders');
        const orderData = await orderResponse.json();
        if (Array.isArray(orderData)) {
          const formattedOrders = orderData.map(order => {
            let uiStage = 'To Cook';
            if (order.status === 'preparing') uiStage = 'Preparing';
            if (order.status === 'Prepared') uiStage = 'Completed';
            let parsedItems = [];
            try { parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items; } catch (e) { parsedItems = []; }
            return { id: order.id, orderNo: order.id.toString(), table: order.session_id ? `S-${order.session_id}` : 'Walk-in', time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), stage: uiStage, items: Array.isArray(parsedItems) ? parsedItems.map(i => ({ ...i, done: false })) : [] };
          });
          setOrders(formattedOrders);
        }
      } catch (err) { console.error("Failed to load data:", err); } finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, currentStage) => {
    let nextStageUI = currentStage, nextStageDB = '';
    if (currentStage === 'To Cook') { nextStageUI = 'Preparing'; nextStageDB = 'preparing'; }
    else if (currentStage === 'Preparing') { nextStageUI = 'Completed'; nextStageDB = 'Prepared'; }
    else return;
    setOrders(orders.map(order => order.id === orderId ? { ...order, stage: nextStageUI } : order));
    try {
      const response = await fetch('http://localhost:5000/api/orders/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status: nextStageDB }) });
      if (!response.ok) throw new Error("Failed to update");
    } catch (err) { console.error("Failed to update status:", err.message); }
  };

  const toggleItemDone = (orderId, itemIndex) => {
    setOrders(orders.map(order => {
      if (order.id !== orderId) return order;
      const newItems = [...order.items];
      newItems[itemIndex] = { ...newItems[itemIndex], done: !newItems[itemIndex].done };
      return { ...order, items: newItems };
    }));
  };

  const filteredOrders = orders.filter(order => {
    if (activeStage !== 'All' && order.stage !== activeStage) return false;
    if (sidebarFilter) { if (!order.items.some(item => item.name === sidebarFilter)) return false; }
    if (searchQuery) { const q = searchQuery.toLowerCase(); return order.orderNo.toLowerCase().includes(q) || order.items.some(i => i.name.toLowerCase().includes(q)); }
    return true;
  });

  const stages = [
    { key: 'All', icon: null, color: 'bg-slate-100 text-slate-600' },
    { key: 'To Cook', icon: <Flame size={14}/>, color: 'bg-red-50 text-red-600 border-red-200' },
    { key: 'Preparing', icon: <Clock size={14}/>, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { key: 'Completed', icon: <Check size={14}/>, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' }
  ];

  const stageCardColor = {
    'To Cook': 'border-l-red-500',
    'Preparing': 'border-l-amber-500',
    'Completed': 'border-l-emerald-500 opacity-60'
  };

  const stageBadge = {
    'To Cook': 'bg-red-50 text-red-600 border border-red-200',
    'Preparing': 'bg-amber-50 text-amber-600 border border-amber-200',
    'Completed': 'bg-emerald-50 text-emerald-600 border border-emerald-200'
  };

  return (
    <div className="h-screen flex bg-transparent text-slate-900 font-sans">
      
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {userName?.charAt(0).toUpperCase() || '51'}
          </div>
          <span className="font-extrabold text-lg text-slate-800 tracking-tight">{userName || 'Kitchen'}</span>
        </div>
        <div className="p-3 border-b border-slate-100">
          <button onClick={() => setView(VIEWS.DASHBOARD)} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors">
            <Home size={16}/> Back to Dashboard
          </button>
        </div>
        <div className="px-4 pt-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Filter by</div>
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-2 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories</div>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSidebarFilter(sidebarFilter === cat.name ? null : cat.name)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg mb-0.5 transition-all font-medium ${sidebarFilter === cat.name ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >{cat.name}</button>
          ))}
          <div className="px-2 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</div>
          {productData.slice(0, 6).map(prod => (
            <button key={prod.id} onClick={() => setSidebarFilter(sidebarFilter === prod.name ? null : prod.name)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg mb-0.5 transition-all font-medium ${sidebarFilter === prod.name ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >{prod.name}</button>
          ))}
        </div>
        {sidebarFilter && (
          <div className="p-3 border-t border-slate-100">
            <button onClick={() => setSidebarFilter(null)} className="w-full text-xs font-bold text-red-500 hover:bg-red-50 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"><X size={12}/> Clear Filter</button>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {stages.map(s => {
              const count = orders.filter(o => s.key === 'All' ? true : o.stage === s.key).length;
              return (
                <button key={s.key} onClick={() => setActiveStage(s.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border ${activeStage === s.key ? `${s.color} border-current shadow-sm` : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                >
                  {s.icon} {s.key} <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
          <div className="relative">
            <input type="text" placeholder="Search order or item..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-64 transition-all" />
            <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
          </div>
        </div>

        {/* Orders Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-transparent">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Loading Orders...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOrders.length === 0 && (
                <div className="col-span-full text-center py-20 text-slate-400 font-medium">No orders found for this stage.</div>
              )}
              {filteredOrders.map(order => (
                <div key={order.id} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all border-l-4 ${stageCardColor[order.stage] || ''} animate-fadeIn`}>
                  {/* Card Header */}
                  <div onClick={() => handleStatusChange(order.id, order.stage)}
                    className="px-5 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-black text-slate-900">#{order.orderNo}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stageBadge[order.stage]}`}>{order.stage}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-teal-600 font-bold">{order.table === 'Walk-in' ? 'Walk-in' : `Table ${order.table}`}</span>
                      <span className="text-slate-400 font-mono text-xs flex items-center gap-1"><Clock size={12}/> {order.time}</span>
                    </div>
                    {order.stage !== 'Completed' && <p className="text-[10px] text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium">Click to advance →</p>}
                  </div>
                  {/* Items */}
                  <div className="px-5 py-3 space-y-2 min-h-[100px]">
                    {order.items.map((item, idx) => (
                      <div key={idx} onClick={() => toggleItemDone(order.id, idx)}
                        className={`flex gap-3 text-sm cursor-pointer select-none transition-all py-1 rounded-lg px-2 -mx-2 ${item.done ? 'opacity-30 line-through bg-emerald-50' : 'hover:bg-slate-50'}`}>
                        <span className="font-bold w-8 text-right text-slate-500">{item.qty}×</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{item.name}</div>
                          {item.note && <div className="text-xs text-amber-600 italic">"{item.note}"</div>}
                        </div>
                        {item.done && <Check size={14} className="text-emerald-500 mt-0.5"/>}
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 px-5 py-2 text-center text-xs font-semibold text-slate-400 border-t border-slate-100">
                    {order.items.reduce((acc, i) => acc + (parseInt(i.qty) || 0), 0)} items total
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplayView;
