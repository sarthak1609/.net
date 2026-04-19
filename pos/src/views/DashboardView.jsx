import React, { useState, useRef, useEffect } from 'react';
import { Monitor, MoreVertical, Settings, Tv, User, Plus, X, Calendar, DollarSign, MapPin, UserCircle, Clock, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';

const DashboardView = ({ setView, posStations, setPosStations, setActivePos, userName }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);

  const [newPos, setNewPos] = useState({ 
    name: '', 
    location: '', 
    status: 'Online',
    startedOn: new Date().toISOString().slice(0, 16),
    shiftManager: '',
    lastEarnings: 0
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddPos = (e) => {
    e.preventDefault();
    if (!newPos.name || !newPos.location) return;
    
    const newStation = {
      id: Date.now().toString(),
      name: newPos.name,
      location: newPos.location,
      status: newPos.status,
      lastClosing: new Date(newPos.startedOn).toLocaleDateString(),
      lastSales: Number(newPos.lastEarnings),
      shiftManager: newPos.shiftManager
    };

    const updated = [...(posStations || []), newStation];
    setPosStations(updated);
    localStorage.setItem('posStations', JSON.stringify(updated));
    setIsModalOpen(false);
    setNewPos({ name: '', location: '', status: 'Online', startedOn: new Date().toISOString().slice(0, 16), shiftManager: '', lastEarnings: 0 });
  };

  const handleDeletePos = (id) => {
    const updated = posStations.filter(s => s.id !== id);
    setPosStations(updated);
    localStorage.setItem('posStations', JSON.stringify(updated));
    setOpenMenuId(null);
  };

  const handleOpenSession = (station) => {
    setActivePos(station);
    setView(VIEWS.POS_SESSION);
  };

  const statusColors = {
    Online: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Offline: 'bg-slate-100 text-slate-500 border-slate-200',
    Maintenance: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  const statusDot = {
    Online: 'bg-emerald-500',
    Offline: 'bg-slate-400',
    Maintenance: 'bg-amber-500'
  };

  return (
    <div className="p-6 md:p-10 min-h-[85vh] animate-fadeIn relative z-10">
       
       {/* Header */}
       <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
          <div>
            <p className="text-sm font-semibold text-teal-600 tracking-wide uppercase mb-1">Dashboard</p>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Point of Sale</h1>
          </div>
          <button 
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-teal-600/25 transition-all hover:shadow-lg hover:shadow-teal-600/30 active:scale-[0.97]"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} strokeWidth={2.5} /> Add Terminal
          </button>
       </div>

       {/* Cards Grid */}
       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
         {posStations?.map(station => (
           <div key={station.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-200/80 hover:border-slate-300 relative group transition-all duration-300 animate-fadeIn">
              <div className="p-6">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-50 rounded-xl border border-teal-100 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all duration-300 shadow-sm">
                            <Monitor size={22} strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">{station.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-full border ${statusColors[station.status] || statusColors.Online}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[station.status] || statusDot.Online}`}></span>
                                {station.status}
                              </span>
                            </div>
                          </div>
                      </div>

                      <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === station.id ? null : station.id);
                            }} 
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {openMenuId === station.id && (
                            <div ref={menuRef} className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 z-20 overflow-hidden animate-scaleIn p-1.5">
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg flex items-center gap-3 transition-colors" 
                                  onClick={() => { setView(VIEWS.SETTINGS); setOpenMenuId(null); }}
                                >
                                  <Settings size={16} /> Settings
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg flex items-center gap-3 transition-colors"
                                  onClick={() => { setView(VIEWS.KITCHEN_DISPLAY); setOpenMenuId(null); }}
                                >
                                  <Tv size={16} /> Kitchen Display
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg flex items-center gap-3 transition-colors"
                                  onClick={() => { setView(VIEWS.CUSTOMER_DISPLAY); setOpenMenuId(null); }}
                                >
                                  <User size={16} /> Customer Display
                                </button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors"
                                  onClick={() => handleDeletePos(station.id)}
                                >
                                  <X size={16} /> Remove
                                </button>
                            </div>
                          )}
                      </div>
                  </div>

                  {/* Info Rows */}
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={15} className="text-slate-400 shrink-0" />
                      <span className="text-slate-500">Location</span>
                      <span className="ml-auto text-slate-800 font-semibold">{station.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={15} className="text-slate-400 shrink-0" />
                      <span className="text-slate-500">Started On</span>
                      <span className="ml-auto text-slate-800 font-semibold">{station.lastClosing}</span>
                    </div>
                    {station.shiftManager && (
                      <div className="flex items-center gap-3 text-sm">
                        <UserCircle size={15} className="text-slate-400 shrink-0" />
                        <span className="text-slate-500">Manager</span>
                        <span className="ml-auto text-slate-800 font-semibold">{station.shiftManager}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">
                      <DollarSign size={15} className="text-emerald-600 shrink-0" />
                      <span className="text-emerald-700 font-medium">Last Earnings</span>
                      <span className="ml-auto text-emerald-700 font-bold text-base">${station.lastSales.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-600/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-sm" 
                    onClick={() => handleOpenSession(station)}
                  >
                    <Activity size={16} strokeWidth={2.5} /> Open Session
                  </button>
              </div>
           </div>
         ))}
       </div>

       {/* ===== Add POS Modal ===== */}
       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
           <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
             {/* Modal Header */}
             <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50">
               <div>
                 <h2 className="text-xl font-extrabold text-slate-900">Create New Terminal</h2>
                 <p className="text-sm text-slate-500 mt-0.5">Set up a new point of sale station</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-all">
                 <X size={20} />
               </button>
             </div>

             {/* Modal Body */}
             <form onSubmit={handleAddPos} className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Station Name *</label>
                   <input 
                     required type="text" 
                     value={newPos.name}
                     onChange={e => setNewPos({...newPos, name: e.target.value})}
                     placeholder="e.g. Front Counter 1"
                     className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location / Floor *</label>
                   <input 
                     required type="text" 
                     value={newPos.location}
                     onChange={e => setNewPos({...newPos, location: e.target.value})}
                     placeholder="e.g. Ground Floor"
                     className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shift Manager</label>
                   <input 
                     type="text" 
                     value={newPos.shiftManager}
                     onChange={e => setNewPos({...newPos, shiftManager: e.target.value})}
                     placeholder="e.g. Sarah Connor"
                     className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Started On *</label>
                   <input 
                     required type="datetime-local" 
                     value={newPos.startedOn}
                     onChange={e => setNewPos({...newPos, startedOn: e.target.value})}
                     className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Money Earned Last Session ($)</label>
                   <input 
                     type="number" min="0" step="0.01"
                     value={newPos.lastEarnings}
                     onChange={e => setNewPos({...newPos, lastEarnings: e.target.value})}
                     className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                   <select 
                     value={newPos.status}
                     onChange={e => setNewPos({...newPos, status: e.target.value})}
                     className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all appearance-none"
                   >
                     <option value="Online">Online</option>
                     <option value="Offline">Offline</option>
                     <option value="Maintenance">Maintenance</option>
                   </select>
                 </div>
               </div>

               {/* Modal Footer */}
               <div className="pt-8 flex gap-3 justify-end">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                 <button type="submit" className="px-8 py-3 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 transition-all active:scale-[0.97]">Create Terminal</button>
               </div>
             </form>
           </div>
         </div>
       )}
     {/* Footer Branding */}
     <footer className="mt-20 py-10 border-t border-slate-200/50 flex flex-col items-center justify-center text-slate-400">
        <div className="flex items-center gap-2 group transition-all duration-300 hover:scale-105">
           <span className="text-xs font-bold tracking-widest uppercase">Powered by 51Cafe</span>
           <span className="text-red-500 animate-pulse">❤️</span>
        </div>
     </footer>
    </div>
  );
};

export default DashboardView;
