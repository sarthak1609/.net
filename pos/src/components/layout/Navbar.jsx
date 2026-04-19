import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Package, BarChart2, ChevronDown, LogOut } from 'lucide-react';
import { VIEWS } from '../../constants';

const Navbar = ({ currentView, setView, onLogout, userName }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null); 
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { 
      label: 'Orders', icon: <ShoppingCart size={18} />, 
      subItems: [
        { label: 'Orders', action: () => setView(VIEWS.ORDER_LIST) },
        { label: 'Payments', action: () => setView(VIEWS.PAYMENT_LIST) },
        { label: 'Customers', action: () => setView(VIEWS.CUSTOMER_LIST) }
      ]
    },
    { 
      label: 'Products', icon: <Package size={18} />, 
      subItems: [
        { label: 'Products', action: () => setView(VIEWS.PRODUCT_LIST) },
        { label: 'Category', action: () => setView(VIEWS.CATEGORY_LIST) }
      ]
    },
    { 
      label: 'Reporting', icon: <BarChart2 size={18} />, 
      subItems: [
        { label: 'Dashboard', action: () => setView(VIEWS.REPORTING_DASHBOARD) }
      ] 
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between relative z-50 shadow-sm">
      <div className="flex items-center gap-10">
        {/* Logo or Home Button */}
        {currentView === VIEWS.DASHBOARD ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-600/25">
              {userName?.charAt(0).toUpperCase() || '51'}
            </div>
            <span className="text-slate-900 font-extrabold text-xl tracking-tight">{userName || 'Cafe'}</span>
          </div>
        ) : (
          <button 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 px-3 py-2 rounded-lg font-bold transition-all duration-200"
            onClick={() => setView(VIEWS.DASHBOARD)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </button>
        )}
        
        {/* Menu */}
        <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <button 
                className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 ${activeDropdown === index ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
              >
                {item.icon} {item.label} <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === index && item.subItems.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 overflow-hidden animate-scaleIn">
                  <div className="p-1.5">
                    {item.subItems.map((sub, subIdx) => (
                      <button key={subIdx} onClick={() => { sub.action(); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors">
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button 
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-all"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
            {userName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="text-left hidden sm:block">
             <div className="text-sm font-bold text-slate-800 leading-none">{userName || 'Admin'}</div>
             <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Cafe Manager</div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 overflow-hidden animate-scaleIn p-1.5">
            <button 
              onClick={onLogout}
              className="w-full px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg text-left flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} /> Close Session
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
