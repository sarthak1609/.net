import React from 'react';
import { ArrowLeft, FileText, Download, TrendingUp, TrendingDown, ShoppingCart, DollarSign, BarChart2 } from 'lucide-react';
import { VIEWS } from '../constants';

const KPICard = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'} transition-colors`}>{icon}</div>
      <div className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full border ${isPositive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
        {isPositive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-bold mb-1">{title}</h3>
    <div className="text-3xl font-black text-slate-900">{value}</div>
  </div>
);

const ReportingView = ({ setView }) => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(VIEWS.DASHBOARD)} className="text-slate-400 hover:text-teal-600 p-2 hover:bg-teal-50 rounded-xl transition-colors"><ArrowLeft size={20}/></button>
          <div>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Analytics</p>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-sm font-bold border border-teal-200 hover:bg-teal-100 transition-colors">Restaurant/Bar</button>
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-sm flex items-center gap-1.5 border-r border-slate-200 transition-colors"><FileText size={14} /> PDF</button>
            <button className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-sm flex items-center gap-1.5 transition-colors"><Download size={14} /> XLS</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <KPICard title="Total Orders" value="90" change="10%" isPositive={true} icon={<ShoppingCart size={20}/>}/>
        <KPICard title="Revenue" value="$190" change="200%" isPositive={true} icon={<DollarSign size={20}/>}/>
        <KPICard title="Avg. Order" value="$80" change="20%" isPositive={false} icon={<BarChart2 size={20}/>}/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-extrabold mb-6">Sales Trend</h3>
          <div className="relative h-64 w-full">
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-slate-400 font-medium"><span>$1000</span><span>$500</span><span>$100</span><span>$10</span></div>
            <div className="absolute left-14 right-0 top-2 bottom-8 border-l border-b border-slate-200">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2"/>
                <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2"/>
                <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2"/>
                <path d="M0,100 L15,60 L30,50 L45,20 L60,80 L75,50 L100,50" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M0,100 L15,60 L30,50 L45,20 L60,80 L75,50 L100,50 V100 H0 Z" fill="url(#teal-grad)" opacity="0.15"/>
                <defs><linearGradient id="teal-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d9488"/><stop offset="100%" stopColor="#0d9488" stopOpacity="0"/></linearGradient></defs>
              </svg>
            </div>
            <div className="absolute left-14 right-0 bottom-0 flex justify-between text-xs text-slate-400 font-medium pt-2"><span>9AM</span><span>12PM</span><span>6PM</span><span>9PM</span></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-extrabold mb-6">Top Categories</h3>
          <div className="flex items-center justify-center gap-10 h-64">
            <div className="w-48 h-48 rounded-full shadow-lg" style={{background: 'conic-gradient(#0d9488 0% 45%, #f59e0b 45% 75%, #3b82f6 75% 90%, #ef4444 90% 100%)'}}></div>
            <div className="space-y-3">
              {[{c:'#0d9488',n:'Pizza',p:'45%'},{c:'#f59e0b',n:'Burger',p:'30%'},{c:'#3b82f6',n:'Drinks',p:'15%'},{c:'#ef4444',n:'Appetizer',p:'10%'}].map((i,x) => (
                <div key={x} className="flex items-center gap-3 text-sm font-medium text-slate-700"><div className="w-3.5 h-3.5 rounded-md" style={{background:i.c}}></div>{i.n} <span className="text-slate-400 ml-auto">{i.p}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50"><h3 className="text-slate-900 font-extrabold">Top Products</h3></div>
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100"><tr><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Qty</th><th className="px-6 py-3 text-right">Revenue</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {[{n:'Margherita Pizza',q:45,r:'$2,500'},{n:'Cheese Burger',q:30,r:'$2,200'},{n:'Fries',q:22,r:'$670'},{n:'Beer',q:18,r:'$2,700'}].map((i,x) => (
                <tr key={x} className="hover:bg-teal-50/20"><td className="px-6 py-3 text-slate-900 font-bold">{i.n}</td><td className="px-6 py-3 text-slate-500">{i.q}</td><td className="px-6 py-3 text-right font-bold text-teal-600">{i.r}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50"><h3 className="text-slate-900 font-extrabold">Top Categories</h3></div>
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100"><tr><th className="px-6 py-3 text-left">Category</th><th className="px-6 py-3 text-right">Revenue</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {[{n:'Pizza',r:'$12,500'},{n:'Burger',r:'$3,000'},{n:'Drinks',r:'$8,000'},{n:'Dessert',r:'$2,100'}].map((i,x) => (
                <tr key={x} className="hover:bg-teal-50/20"><td className="px-6 py-3 text-slate-900 font-bold">{i.n}</td><td className="px-6 py-3 text-right font-bold text-teal-600">{i.r}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportingView;
