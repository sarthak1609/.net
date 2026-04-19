import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import DashboardView from './views/DashboardView';
import OrderListView from './views/OrderListView';
import OrderDetailView from './views/OrderDetailView';
import PaymentListView from './views/PaymentListView';
import SettingsView from './views/SettingsView';
import POSSessionView from './views/POSSessionView';
import CustomerListView from './views/CustomerListView';
import CustomerDetailView from './views/CustomerDetailView';
import ProductListView from './views/ProductListView';
import ProductDetailView from './views/ProductDetailView';
import CategoryListView from './views/CategoryListView';
import FloorDetailView from './views/FloorDetailView';
import ReportingView from './views/ReportingView';
import KitchenDisplayView from './views/KitchenDisplayView';
import AuthView from './views/AuthView';
import CustomerDisplayView from './views/CustomerDisplayView'; // Import
import Background from './components/ui/Background';
import { VIEWS, MOCK_FLOORS } from './constants';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  const [posStations, setPosStations] = useState([]);
  const [activePos, setActivePos] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    const savedStations = localStorage.getItem('posStations');
    
    if (savedStations) {
      try {
        setPosStations(JSON.parse(savedStations));
      } catch (e) {
        console.error('Failed to parse pos stations');
      }
    } else {
      // Default initial station
      const defaultStations = [
        { id: '1', name: '51Cafe - Main Register', location: 'Ground Floor', status: 'Online', lastClosing: '01/01/2026', lastSales: 5000 }
      ];
      setPosStations(defaultStations);
      localStorage.setItem('posStations', JSON.stringify(defaultStations));
    }

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView(VIEWS.DASHBOARD);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Shared State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [floors, setFloors] = useState(MOCK_FLOORS);

  // KITCHEN STATE
  const [kitchenOrders, setKitchenOrders] = useState([
      { 
          id: 101, 
          orderNo: '2205', 
          table: '6', 
          time: '10:30', 
          stage: 'To Cook', 
          items: [
              { name: 'Burger', qty: 3, done: false },
              { name: 'Pizza', qty: 3, done: false },
              { name: 'Coffee', qty: 3, done: false },
              { name: 'Water', qty: 3, done: true } 
          ] 
      },
      { 
          id: 102, 
          orderNo: '2206', 
          table: '2', 
          time: '10:32', 
          stage: 'Preparing', 
          items: [
              { name: 'Pasta', qty: 2, done: false },
              { name: 'Coke', qty: 2, done: false }
          ] 
      }
  ]);

  const handleNewKitchenOrder = (newOrder) => {
      setKitchenOrders(prev => [...prev, newOrder]);
  };

  const renderView = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD: return <DashboardView setView={setCurrentView} posStations={posStations} setPosStations={setPosStations} setActivePos={setActivePos} userName={user?.username} />;
      case VIEWS.SETTINGS: return <SettingsView setView={setCurrentView} />;
      case VIEWS.ORDER_LIST: return <OrderListView setView={setCurrentView} setSelectedOrder={setSelectedOrder} />;
      case VIEWS.ORDER_DETAIL: return <OrderDetailView order={selectedOrder} setView={setCurrentView} />;
      case VIEWS.PAYMENT_LIST: return <PaymentListView setView={setCurrentView} />;
      case VIEWS.POS_SESSION: return <POSSessionView setView={setCurrentView} floors={floors} onSendToKitchen={handleNewKitchenOrder} userName={user?.username} activePos={activePos} posStations={posStations} setPosStations={setPosStations} />;
      case VIEWS.CUSTOMER_LIST: return <CustomerListView setView={setCurrentView} setSelectedCustomer={setSelectedCustomer} />;
      case VIEWS.CUSTOMER_DETAIL: return <CustomerDetailView customer={selectedCustomer} setView={setCurrentView} />;
      case VIEWS.PRODUCT_LIST: return <ProductListView setView={setCurrentView} setSelectedProduct={setSelectedProduct} />;
      case VIEWS.PRODUCT_DETAIL: return <ProductDetailView product={selectedProduct} setView={setCurrentView} />;
      case VIEWS.CATEGORY_LIST: return <CategoryListView setView={setCurrentView} />;
      case VIEWS.FLOOR_DETAIL: return <FloorDetailView setView={setCurrentView} floors={floors} setFloors={setFloors} />;
      case VIEWS.REPORTING_DASHBOARD: return <ReportingView setView={setCurrentView} />;
      case VIEWS.KITCHEN_DISPLAY: return <KitchenDisplayView setView={setCurrentView} orders={kitchenOrders} setOrders={setKitchenOrders} userName={user?.username} />;
      case VIEWS.CUSTOMER_DISPLAY: return <CustomerDisplayView setView={setCurrentView} />;
      default: return <DashboardView setView={setCurrentView} userName={user?.username} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      <Background />
      {!isAuthenticated ? (
        <AuthView onLogin={handleLogin} />
      ) : (
        <>
          {/* Hide Navbar when in POS/Kitchen/Customer Display modes */}
          {currentView !== VIEWS.POS_SESSION && currentView !== VIEWS.KITCHEN_DISPLAY && currentView !== VIEWS.CUSTOMER_DISPLAY && (
            <Navbar 
              currentView={currentView} 
              setView={setCurrentView} 
              onLogout={handleLogout} 
              userName={user?.username || 'User'}
            />
          )}
          <main className="relative z-10 flex-1">{renderView()}</main>
        </>
      )}
    </div>
  );
 }
// import React, { useState, useEffect } from 'react';
// import Navbar from './components/layout/Navbar';
// import DashboardView from './views/DashboardView';
// import OrderListView from './views/OrderListView';
// import OrderDetailView from './views/OrderDetailView';
// import PaymentListView from './views/PaymentListView';
// import SettingsView from './views/SettingsView';
// import POSSessionView from './views/POSSessionView';
// import CustomerListView from './views/CustomerListView';
// import CustomerDetailView from './views/CustomerDetailView';
// import ProductListView from './views/ProductListView';
// import ProductDetailView from './views/ProductDetailView';
// import CategoryListView from './views/CategoryListView';
// import FloorDetailView from './views/FloorDetailView';
// import ReportingView from './views/ReportingView';
// import KitchenDisplayView from './views/KitchenDisplayView';
// import AuthView from './views/AuthView';
// import CustomerDisplayView from './views/CustomerDisplayView';
// import { VIEWS, MOCK_FLOORS } from './constants';

// export default function App() {
//   const [user, setUser] = useState(null); // Stores { id, name, email }
//   const [activeSession, setActiveSession] = useState(null); // Stores current session data if open
//   const [lastSessionStats, setLastSessionStats] = useState({ closingDate: '-', sales: 0 }); // Stats from DB
//   const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  
//   // Shared State
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [floors, setFloors] = useState(MOCK_FLOORS);

//   // KITCHEN STATE
//   const [kitchenOrders, setKitchenOrders] = useState([]);

//   // --- Session Management ---

//   // 1. Fetch Session Info on Login
//   const fetchSessionData = async (userId) => {
//     try {
//         // Mocking APIs - Replace with your actual endpoints
//         // Check for active session
//         const activeRes = await fetch(`http://localhost:5000/api/sessions/active?userId=${userId}`);
//         const activeData = await activeRes.json();
        
//         if (activeData && activeData.id) {
//             setActiveSession(activeData);
//         }

//         // Fetch last closed session stats
//         const lastRes = await fetch(`http://localhost:5000/api/sessions/last?userId=${userId}`);
//         const lastData = await lastRes.json();
//         if (lastData) {
//             setLastSessionStats({
//                 closingDate: new Date(lastData.end_time).toLocaleDateString(),
//                 sales: lastData.total_sales
//             });
//         }
//     } catch (err) {
//         console.error("Session fetch error", err);
//         // Fallback mock data
//         setLastSessionStats({ closingDate: '24/01/2026', sales: 1250.00 });
//     }
//   };

//   const handleLogin = (userData) => {
//       setUser(userData);
//       fetchSessionData(userData.id);
//   };

//   const handleStartSession = async () => {
//       try {
//           const response = await fetch('http://localhost:5000/api/sessions/start', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ userId: user.id, openingBalance: 0 }) // You can pass previous closing balance here
//           });
//           const newSession = await response.json();
//           setActiveSession(newSession);
//           // Navigate to POS immediately or stay on dashboard to click "Continue"
//           setCurrentView(VIEWS.POS_SESSION);
//       } catch (err) {
//           console.error("Failed to start session", err);
//           // Fallback
//           setActiveSession({ id: Date.now(), userId: user.id, status: 'open' });
//           setCurrentView(VIEWS.POS_SESSION);
//       }
//   };

//   const handleCloseSession = async () => {
//       if (activeSession) {
//           try {
//               await fetch(`http://localhost:5000/api/sessions/${activeSession.id}/close`, {
//                   method: 'POST',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ userId: user.id })
//               });
//           } catch (err) {
//               console.error("Failed to close session", err);
//           }
//       }
//       setActiveSession(null);
//       setUser(null); // Log out
//       setCurrentView(VIEWS.DASHBOARD);
//   };

//   const handleNewKitchenOrder = (newOrder) => {
//       setKitchenOrders(prev => [...prev, newOrder]);
//   };

//   // --- Render Logic ---

//   if (!user) {
//     return <AuthView onLogin={handleLogin} />;
//   }

//   const renderView = () => {
//     switch (currentView) {
//       case VIEWS.DASHBOARD: 
//         return <DashboardView 
//                   setView={setCurrentView} 
//                   activeSession={activeSession}
//                   lastSessionStats={lastSessionStats}
//                   onStartSession={handleStartSession}
//                />;
      
//       case VIEWS.SETTINGS: return <SettingsView setView={setCurrentView} />;
//       case VIEWS.ORDER_LIST: return <OrderListView setView={setCurrentView} setSelectedOrder={setSelectedOrder} />;
//       case VIEWS.ORDER_DETAIL: return <OrderDetailView order={selectedOrder} setView={setCurrentView} />;
//       case VIEWS.PAYMENT_LIST: return <PaymentListView setView={setCurrentView} />;
      
//       case VIEWS.POS_SESSION: 
//         return <POSSessionView 
//                   setView={setCurrentView} 
//                   floors={floors} 
//                   onSendToKitchen={handleNewKitchenOrder} 
//                   sessionId={activeSession?.id} // Pass Session ID for orders
//                />;
      
//       case VIEWS.CUSTOMER_LIST: return <CustomerListView setView={setCurrentView} setSelectedCustomer={setSelectedCustomer} />;
//       case VIEWS.CUSTOMER_DETAIL: return <CustomerDetailView customer={selectedCustomer} setView={setCurrentView} />;
//       case VIEWS.PRODUCT_LIST: return <ProductListView setView={setCurrentView} setSelectedProduct={setSelectedProduct} />;
//       case VIEWS.PRODUCT_DETAIL: return <ProductDetailView product={selectedProduct} setView={setCurrentView} />;
//       case VIEWS.CATEGORY_LIST: return <CategoryListView setView={setCurrentView} />;
//       case VIEWS.FLOOR_DETAIL: return <FloorDetailView setView={setCurrentView} floors={floors} setFloors={setFloors} />;
//       case VIEWS.REPORTING_DASHBOARD: return <ReportingView setView={setCurrentView} />;
//       case VIEWS.KITCHEN_DISPLAY: return <KitchenDisplayView setView={setCurrentView} orders={kitchenOrders} setOrders={setKitchenOrders} />;
//       case VIEWS.CUSTOMER_DISPLAY: return <CustomerDisplayView setView={setCurrentView} />;
      
//       default: return <DashboardView setView={setCurrentView} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-teal-500 selection:text-gray-900">
//       {currentView !== VIEWS.POS_SESSION && currentView !== VIEWS.KITCHEN_DISPLAY && currentView !== VIEWS.CUSTOMER_DISPLAY && (
//         <Navbar 
//           currentView={currentView} 
//           setView={setCurrentView} 
//           onLogout={handleCloseSession} 
//           userName={user.name}
//         />
//       )}
//       <main className="relative">{renderView()}</main>
//     </div>
//   );
// }
