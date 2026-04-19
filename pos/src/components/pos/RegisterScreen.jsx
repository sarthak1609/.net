import React, { useState, useEffect } from 'react';
import { Search, Menu, Send, Check, X, Tag, ShoppingCart } from 'lucide-react';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeIn flex items-center gap-3 font-semibold text-sm">
      <div className="bg-emerald-500 text-white p-1 rounded-full"><Check size={14} /></div>
      {message}
    </div>
  );
};

const CouponModal = ({ isOpen, onClose, onApply }) => {
  const [code, setCode] = useState('');
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl w-96 animate-scaleIn">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-slate-900 font-extrabold text-lg">Apply Coupon</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors"><X size={18}/></button>
        </div>
        <input
          type="text" value={code} onChange={(e) => setCode(e.target.value)}
          placeholder="Enter Code (e.g. SAVE10)"
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-bold mb-5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 uppercase tracking-wide placeholder:text-slate-400 placeholder:font-medium transition-all"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-lg font-semibold text-sm transition-colors">Cancel</button>
          <button onClick={() => { onApply(code); setCode(''); }} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold text-sm shadow-md shadow-teal-600/25 transition-all">Apply</button>
        </div>
      </div>
    </div>
  );
};

const RegisterScreen = ({ activeTable, onExit, onPayment, onSendToKitchen }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [numpadBuffer, setNumpadBuffer] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [notification, setNotification] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); else setProducts([]); setLoading(false); })
      .catch(err => { console.error("Failed to load products:", err); setLoading(false); });
    
    fetch('http://localhost:5000/api/category')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); else setCategories([]); })
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  const handleProductClick = (product) => {
    const existingIndex = cart.findIndex(item => item.id === product.id && item.price === product.price);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].qty += 1;
      setCart(newCart);
      setSelectedItemIndex(existingIndex);
    } else {
      setCart([...cart, { ...product, qty: 1, discount: 0 }]);
      setSelectedItemIndex(cart.length);
    }
    setNumpadBuffer("");
  };

  const handleNumpadInput = (value) => setNumpadBuffer(prev => prev + value);

  const handleFunctionKey = (type) => {
    if (selectedItemIndex === null || !cart[selectedItemIndex]) return;
    const bufferValue = parseFloat(numpadBuffer);
    const newCart = [...cart];
    const item = newCart[selectedItemIndex];
    switch (type) {
      case 'Qty': if (!isNaN(bufferValue)) { item.qty = bufferValue; setCart(newCart); setNumpadBuffer(""); } break;
      case 'Price': if (!isNaN(bufferValue)) { item.price = bufferValue; setCart(newCart); setNumpadBuffer(""); } break;
      case 'Disc': if (!isNaN(bufferValue)) { setShowCoupon(true); } else { setNotification("Enter discount % first"); } break;
      case 'Backspace':
        if (numpadBuffer.length > 0) setNumpadBuffer(prev => prev.slice(0, -1));
        else { setCart(cart.filter((_, i) => i !== selectedItemIndex)); setSelectedItemIndex(null); }
        break;
      case 'ToggleSign': if (!isNaN(bufferValue)) setNumpadBuffer((bufferValue * -1).toString()); break;
      default: break;
    }
  };

  const handleApplyCoupon = (code) => {
    if (code.trim().length > 0) {
        const discountPercent = parseFloat(numpadBuffer);
        const newCart = [...cart];
        if (newCart[selectedItemIndex]) {
            newCart[selectedItemIndex].discount = discountPercent;
            setCart(newCart);
            setNotification(`Coupon Applied: ${discountPercent}% Off`);
            setNumpadBuffer("");
        }
        setShowCoupon(false);
    } else { setNotification("Invalid Coupon Code"); }
  };

  const handleSendOrder = async () => {
    if (cart.length === 0) { setNotification("Cart is empty"); return; }
    const newOrder = {
        id: Date.now(),
        orderNo: Math.floor(1000 + Math.random() * 9000).toString(),
        table: activeTable ? activeTable.number : 'Walk-in',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'To Cook',
        items: cart.map(item => ({ name: item.name, qty: item.qty, note: item.note, done: false }))
    };

    try {
      const subtotal = cart.reduce((sum, item) => {
        const itemTotal = item.price * item.qty;
        const discountedTotal = itemTotal - itemTotal * (item.discount / 100);
        return sum + discountedTotal;
      }, 0);
      const finalAmount = parseFloat((subtotal * 1.05).toFixed(2));

      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 0,
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'To Cook',
          items: cart.map(item => ({ name: item.name, qty: item.qty, price: parseFloat(item.price.toFixed(2)) })),
          total_amount: finalAmount,
          paying_status: 'unpaid',
          session_id: 2,
          payment_method: 'cash'
        })
      });
    } catch (error) {
      console.error("Save error:", error);
    }

    if (onSendToKitchen) onSendToKitchen(newOrder);
    setNotification("Order Sent to Kitchen 👨‍🍳");
  };

  const productList = products.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const total = cart.reduce((sum, item) => {
      const itemTotal = item.price * item.qty;
      return sum + (itemTotal - itemTotal * (item.discount / 100));
  }, 0);

  return (
    <div className="h-full flex flex-col md:flex-row bg-transparent text-slate-900 relative font-sans">
      <Notification message={notification} onClose={() => setNotification(null)} />
      <CouponModal isOpen={showCoupon} onClose={() => setShowCoupon(false)} onApply={handleApplyCoupon} />

      {/* ===== LEFT: Products Grid ===== */}
      <div className="flex-1 flex flex-col h-full">
         <div className="h-14 flex items-center justify-end px-6 border-b border-slate-200 bg-white">
             <div className="relative">
                 <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"><Menu size={20} /></button>
                 {menuOpen && (
                     <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 animate-scaleIn">
                         <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Reload Data</button>
                         <button onClick={onExit} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg border-t border-slate-100 mt-1 pt-2 transition-colors">Close Register</button>
                     </div>
                 )}
             </div>
         </div>

         <div className="p-6 flex flex-col gap-4">
             {/* Categories */}
             <div className="flex gap-2 overflow-x-auto pb-1">
                 <button onClick={() => setSelectedCategory(null)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${!selectedCategory ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'}`}>All Items</button>
                 {categories.map(cat => (
                     <button key={cat.id} onClick={() => setSelectedCategory(cat.c_name)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.c_name ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'}`}>{cat.c_name}</button>
                 ))}
             </div>
             {/* Search */}
             <div className="relative">
                 <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full bg-white border border-slate-200 rounded-xl py-3 px-12 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-slate-400"/>
                 <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
             </div>
         </div>

         {/* Product Grid */}
         <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {productList.map((item) => (
                  <div key={item.id} onClick={() => handleProductClick(item)} className="bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col h-36 rounded-2xl group active:scale-[0.97]">
                    <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs mb-2 group-hover:bg-teal-600 group-hover:text-white transition-all">{item.name.substring(0, 2).toUpperCase()}</div>
                        <span className="font-bold text-sm text-slate-800 leading-tight">{item.name}</span>
                    </div>
                    <div className="px-4 pb-3 flex justify-center"><span className="text-teal-700 font-bold text-xs bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">${item.price}</span></div>
                  </div>
                ))}
                {productList.length === 0 && <div className="col-span-full text-center text-slate-400 py-16"><Search size={40} className="mx-auto mb-3 opacity-30"/><p className="font-medium">No products found</p></div>}
            </div>
         </div>
      </div>

      {/* ===== RIGHT: Cart Sidebar ===== */}
      <div className="w-full md:w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
         {/* Cart Header */}
         <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-center">
                <div><span className="text-slate-900 text-base font-extrabold block">Current Order</span><span className="text-slate-400 font-semibold text-sm">Table {activeTable?.number || 'Walk-in'}</span></div>
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-sm font-bold border border-teal-100">{cart.reduce((sum, i) => sum + i.qty, 0)} items</span>
            </div>
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.map((item, idx) => (
                <div key={idx} onClick={() => { setSelectedItemIndex(idx); setNumpadBuffer(""); }} className={`p-3.5 rounded-xl cursor-pointer transition-all border-2 ${selectedItemIndex === idx ? 'bg-teal-50 border-teal-500' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}> 
                   <div className="flex justify-between items-start">
                       <div>
                           <div className={`font-bold ${selectedItemIndex === idx ? 'text-teal-800' : 'text-slate-800'}`}>{item.name}</div>
                           <div className="text-sm text-slate-500 mt-1 font-medium">{item.qty} × ${item.price}</div>
                           {item.discount > 0 && <div className="text-xs text-emerald-700 mt-1 bg-emerald-50 border border-emerald-200 inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold"><Tag size={10}/> {item.discount}% Off</div>}
                       </div>
                       <div className="font-extrabold text-slate-900 text-lg">${((item.price * item.qty) * (1 - (item.discount || 0) / 100)).toFixed(2)}</div>
                   </div>
                </div>
            ))}
            {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3"><div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200"><ShoppingCart size={24}/></div><span className="text-sm font-semibold text-slate-400">Cart is empty</span></div>}
         </div>

         {/* Totals */}
         <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
             <div className="flex justify-between mb-1"><span className="text-slate-500 text-sm font-medium">Subtotal</span><span className="text-slate-700 text-sm font-bold">${total.toFixed(2)}</span></div>
             <div className="flex justify-between mb-3"><span className="text-slate-500 text-sm font-medium">Tax (5%)</span><span className="text-slate-700 text-sm font-bold">${(total * 0.05).toFixed(2)}</span></div>
             <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                 <div><span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Total</span>{numpadBuffer && <span className="text-teal-600 font-mono text-sm">{numpadBuffer}</span>}</div>
                 <div className="text-3xl font-black text-slate-900 tracking-tight">${(total * 1.05).toFixed(2)}</div>
             </div>
         </div>

         {/* Numpad */}
         <div className="p-3 bg-white border-t border-slate-200">
             <div className="grid grid-cols-4 gap-1.5 h-48">
                 <div className="col-span-3 grid grid-cols-3 gap-1.5">
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => <button key={n} onClick={() => handleNumpadInput(n.toString())} className="bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 text-lg font-bold rounded-xl transition-all border border-slate-200 active:scale-95">{n}</button>)}
                     <button onClick={() => handleNumpadInput(".")} className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xl font-bold rounded-xl border border-slate-200">.</button>
                     <button onClick={() => handleFunctionKey('Backspace')} className="bg-slate-50 hover:bg-red-50 text-red-400 hover:text-red-500 text-lg font-bold rounded-xl border border-slate-200 active:scale-95">⌫</button>
                 </div>
                 <div className="col-span-1 grid grid-cols-1 gap-1.5">
                     <button onClick={() => handleFunctionKey('Price')} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase rounded-xl border border-slate-200">Price</button>
                     <button onClick={() => handleFunctionKey('Disc')} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase rounded-xl border border-slate-200">Disc</button>
                     <button onClick={() => handleFunctionKey('Qty')} className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold uppercase rounded-xl border border-teal-200">Qty</button>
                     <button onClick={() => handleFunctionKey('ToggleSign')} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase rounded-xl border border-slate-200">+/-</button>
                 </div>
             </div>
             <div className="grid grid-cols-4 gap-1.5 mt-2">
                 <button onClick={handleSendOrder} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center border border-slate-200 active:scale-95"><Send size={18}/></button>
                 <button onClick={() => onPayment(total * 1.05, cart)} className="col-span-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3.5 rounded-xl text-base shadow-md shadow-teal-600/25 transition-all active:scale-[0.97] flex items-center justify-center gap-2">Pay ${(total * 1.05).toFixed(2)}</button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
