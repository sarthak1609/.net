import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, CreditCard, QrCode, Banknote, Wallet } from 'lucide-react';

const PaymentScreen = ({ total, cartItems, onBack, onComplete }) => {
  const [status, setStatus] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const finalAmount = parseFloat(Number(total).toFixed(2));
  const upiId = 'sarthaksuryavanshi16-2@okaxis';
  const upiUrl = `upi://pay?pa=${upiId}&pn=51Cafe&am=${finalAmount.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

  const handlePaymentSimulation = async () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => onComplete(), 2000);
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white animate-fadeIn">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-200">
          <CheckCircle size={56} className="text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h2>
        <p className="text-slate-400 font-medium">Transaction #{Math.floor(Math.random() * 10000)}</p>
      </div>
    );
  }

  if (!paymentMethod) {
    return (
      <div className="h-full flex flex-col bg-white animate-fadeIn">
        <div className="p-5 border-b border-slate-200 flex items-center gap-4 bg-white">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"><ArrowLeft size={22} /></button>
          <h2 className="text-xl font-extrabold text-slate-900">Payment</h2>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center gap-8 max-w-lg mx-auto w-full">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Due</p>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight">${finalAmount.toFixed(2)}</h1>
          </div>
          <div className="w-full space-y-3">
            {[
              { key: 'UPI', icon: <QrCode size={24}/>, label: 'UPI / QR Code', desc: 'Scan & Pay', color: 'bg-teal-50 text-teal-600 border-teal-200' },
              { key: 'CARD', icon: <CreditCard size={24}/>, label: 'Credit / Debit Card', desc: 'Swipe or Tap', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { key: 'CASH', icon: <Banknote size={24}/>, label: 'Cash', desc: 'Collect cash', color: 'bg-amber-50 text-amber-600 border-amber-200' }
            ].map(m => (
              <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                className="w-full flex items-center gap-5 p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-teal-500 hover:shadow-md transition-all text-left group active:scale-[0.98]">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${m.color}`}>{m.icon}</div>
                <div className="flex-1">
                  <span className="font-bold text-slate-900 text-base block">{m.label}</span>
                  <span className="text-sm text-slate-400 font-medium">{m.desc}</span>
                </div>
                <span className="text-slate-300 group-hover:text-teal-500 transition-colors font-bold text-lg">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white animate-fadeIn">
      <div className="p-5 border-b border-slate-200 flex items-center gap-4">
        <button onClick={() => setPaymentMethod(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"><ArrowLeft size={22} /></button>
        <h2 className="text-xl font-extrabold text-slate-900">
          {paymentMethod === 'UPI' ? 'Scan QR Code' : paymentMethod === 'CARD' ? 'Card Payment' : 'Cash Payment'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        {paymentMethod === 'UPI' && (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 shadow-sm max-w-md w-full text-center mb-8">
            <div className="w-64 h-64 mx-auto mb-6 bg-white rounded-xl p-2"><img src={qrCodeUrl} alt="UPI QR" className="w-full h-full object-contain" /></div>
            <div className="flex items-center justify-center gap-2 text-slate-500 font-semibold"><QrCode size={16} className="text-teal-600"/> 51Cafe</div>
          </div>
        )}
        {paymentMethod !== 'UPI' && (
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-10 max-w-md w-full text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 shadow-sm">
              {paymentMethod === 'CARD' ? <CreditCard size={36} className="text-teal-500"/> : <Banknote size={36} className="text-emerald-500"/>}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{paymentMethod === 'CARD' ? 'Use Terminal' : 'Collect Cash'}</h3>
            <p className="text-slate-400 mb-6 font-medium">{paymentMethod === 'CARD' ? 'Swipe, insert, or tap card' : 'Collect exact amount from customer'}</p>
            <div className="text-4xl font-black text-teal-600">${finalAmount.toFixed(2)}</div>
          </div>
        )}
        <button onClick={handlePaymentSimulation} disabled={status === 'processing'}
          className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.97] text-lg disabled:opacity-50">
          {status === 'processing' ? 'Processing...' : 'Confirm Payment Received'}
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;
