import React, { useState, useEffect } from 'react';
import { Home, Coffee, ClipboardList, Monitor } from 'lucide-react';
import { VIEWS } from '../constants';

import FloorScreen from '../components/pos/FloorScreen';
import RegisterScreen from '../components/pos/RegisterScreen';
import OrderListScreen from '../components/pos/OrderListScreen';
import PaymentScreen from '../components/pos/PaymentScreen';
import ReceiptScreen from '../components/pos/ReceiptScreen';

const POSSessionView = ({ setView, floors, onSendToKitchen, userName, activePos, posStations, setPosStations }) => {
  const [activeTab, setActiveTab] = useState('table'); 
  const [activeTable, setActiveTable] = useState(null);
  const [currentOrderTotal, setCurrentOrderTotal] = useState(0);
  const [currentOrderItems, setCurrentOrderItems] = useState([]); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalPaymentAmount, setFinalPaymentAmount] = useState(0);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  }, []);

  const handleTableSelect = (table) => {
    setActiveTable(table);
    setActiveTab('register');
  };

  const handleGoToPayment = (total, cartItems) => {
    setCurrentOrderTotal(total);
    setCurrentOrderItems(cartItems);
    setFinalPaymentAmount(parseFloat(Number(total).toFixed(2)));
    setActiveTab('payment');
  };

  const handleValidatePayment = () => {
    // Update the active POS station by adding to cumulative earnings
    if (activePos && posStations) {
      const updatedStations = posStations.map(station => 
        station.id === activePos.id 
          ? { ...station, lastSales: Number((station.lastSales + Number(finalPaymentAmount)).toFixed(2)) }
          : station
      );
      setPosStations(updatedStations);
      localStorage.setItem('posStations', JSON.stringify(updatedStations));
    }
    setActiveTab('receipt');
  };

  const handleFinishOrder = () => {
    setActiveTable(null); 
    setActiveTab('table'); 
  };

  const tabClass = (tab) => `px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
    activeTab === tab 
      ? 'bg-white text-teal-700 shadow-sm border border-slate-200' 
      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/60'
  }`;

  return (
    <div className="h-screen flex flex-col bg-transparent text-slate-900 overflow-hidden font-sans">
      
      {['table', 'register', 'orders'].includes(activeTab) && (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
           <div className="flex items-center gap-4">
              <button 
                  onClick={() => setView(VIEWS.DASHBOARD)} 
                  className="text-slate-400 hover:text-teal-600 p-2.5 hover:bg-teal-50 rounded-xl transition-colors"
                  title="Back to Dashboard"
              >
                  <Home size={22} />
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                  <button onClick={() => setActiveTab('table')} className={tabClass('table')}><Coffee size={16}/> Table</button>
                  <button onClick={() => setActiveTab('register')} className={tabClass('register')}><Monitor size={16}/> Register</button>
                  <button onClick={() => setActiveTab('orders')} className={tabClass('orders')}><ClipboardList size={16}/> Orders</button>
              </div>
           </div>

           <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                   <div className="text-xs text-slate-400 font-medium">Logged in as</div>
                   <div className="text-sm font-bold text-slate-800">{userName || 'Administrator'}</div>
               </div>
               <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center font-bold text-white shadow-md shadow-teal-500/25 border-2 border-white">
                 {userName?.charAt(0).toUpperCase() || 'A'}
               </div>
           </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative bg-transparent">
         {activeTab === 'table' && (
            <FloorScreen 
                onTableSelect={handleTableSelect} 
                activeTableId={activeTable?.id} 
                floors={floors} 
            />
         )}
         
         {activeTab === 'register' && (
            <RegisterScreen 
                activeTable={activeTable} 
                onExit={() => setActiveTab('table')} 
                onPayment={handleGoToPayment}
                onSendToKitchen={onSendToKitchen}
            />
         )}

         {activeTab === 'orders' && <OrderListScreen />}

         {activeTab === 'payment' && (
             <PaymentScreen 
                total={currentOrderTotal}
                cartItems={currentOrderItems}
                onBack={() => setActiveTab('register')}
                onComplete={handleValidatePayment}
             />
         )}

         {activeTab === 'receipt' && (
             <ReceiptScreen 
                total={currentOrderTotal}
                onContinue={handleFinishOrder}
              />
         )}
      </div>
    </div>
  );
};

export default POSSessionView;
