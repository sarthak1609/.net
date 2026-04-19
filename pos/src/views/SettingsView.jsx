import React, { useState } from 'react';
import { ArrowLeft, Plus, Save, ArrowRight, CreditCard, QrCode, Banknote, Layout } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { VIEWS } from '../constants';

const ToggleCard = ({ icon, label, description, checked, onChange, children }) => (
  <div className={`p-5 rounded-2xl border-2 transition-all ${checked ? 'bg-teal-50/50 border-teal-200' : 'bg-white border-slate-200'}`}>
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${checked ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'} transition-colors`}>{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-900 font-bold">{label}</span>
          <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-all ${checked ? 'bg-teal-600' : 'bg-slate-200'} relative`}>
            <span className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}/>
          </button>
        </div>
        {description && <p className="text-sm text-slate-400 mt-1 font-medium">{description}</p>}
        {checked && children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  </div>
);

const SettingsView = ({ setView }) => {
  const [settings, setSettings] = useState({ cash: true, digital: true, upi: true, upiId: "123@ybl.com", floorPlan: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPosName, setNewPosName] = useState("");

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(VIEWS.DASHBOARD)} className="text-slate-400 hover:text-teal-600 p-2 hover:bg-teal-50 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <p className="text-sm text-slate-400 font-medium">Point of Sale</p>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900">51Cafe</h1>
              <button onClick={() => setIsModalOpen(true)} className="text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-1"><Plus size={14} /> New</button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setView(VIEWS.DASHBOARD)}>Discard</Button>
          <Button onClick={() => setView(VIEWS.DASHBOARD)}><Save size={16}/> Save</Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50"><h2 className="text-lg font-extrabold text-slate-900">Payment Methods</h2></div>
          <div className="p-6 space-y-4">
            <ToggleCard icon={<Banknote size={20}/>} label="Cash" description="Accept cash payments at the register" checked={settings.cash} onChange={(v) => setSettings({...settings, cash: v})}/>
            <ToggleCard icon={<CreditCard size={20}/>} label="Digital (Bank, Card)" description="Accept card and bank transfers" checked={settings.digital} onChange={(v) => setSettings({...settings, digital: v})}/>
            <ToggleCard icon={<QrCode size={20}/>} label="QR Payment (UPI)" description="Generate a QR code for UPI payments" checked={settings.upi} onChange={(v) => setSettings({...settings, upi: v})}>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">UPI ID</label>
                <input type="text" value={settings.upiId} onChange={(e) => setSettings({...settings, upiId: e.target.value})}
                  className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
              </div>
            </ToggleCard>
          </div>
        </div>

        {/* Interface */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50"><h2 className="text-lg font-extrabold text-slate-900">POS Interface</h2></div>
          <div className="p-6">
            <ToggleCard icon={<Layout size={20}/>} label="Floor Plan" description="Enable table/floor management" checked={settings.floorPlan} onChange={(v) => setSettings({...settings, floorPlan: v})}>
              <button onClick={() => setView(VIEWS.FLOOR_DETAIL)} className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 text-sm">Configure Plan <ArrowRight size={14} /></button>
            </ToggleCard>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New POS" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Discard</Button><Button onClick={() => setIsModalOpen(false)}>Save</Button></>}>
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">POS Name</label>
          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="e.g. Bar" value={newPosName} onChange={(e) => setNewPosName(e.target.value)} autoFocus />
        </div>
      </Modal>
    </div>
  );
};

export default SettingsView;
