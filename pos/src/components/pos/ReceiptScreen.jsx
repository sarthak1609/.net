import React from 'react';
import { Mail, Printer, ArrowRight, CheckCircle } from 'lucide-react';

const ReceiptScreen = ({ onContinue, total = 580 }) => {
  return (
    <div className="h-full bg-slate-50 flex flex-col items-center justify-center animate-fadeIn p-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>

        {/* Logo */}
        <div className="w-12 h-12 bg-teal-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md shadow-teal-600/25">51</div>

        <h1 className="text-3xl font-black text-slate-900 mb-1">Amount Paid</h1>
        <p className="text-4xl font-black text-teal-600 mb-2">${typeof total === 'number' ? total.toFixed(2) : total}</p>
        <p className="text-slate-400 font-medium mb-8">Change: $0.00</p>

        <div className="flex gap-3 mb-8">
          <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors">
            <Mail size={16} /> Email
          </button>
          <button className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors">
            <Printer size={16} /> Print
          </button>
        </div>

        <button onClick={onContinue}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 text-base transition-all active:scale-[0.97]">
          New Order <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ReceiptScreen;
