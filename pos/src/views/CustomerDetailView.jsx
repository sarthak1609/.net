import React, { useState } from 'react';
import { ArrowLeft, Save, Camera, User, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';

const CustomerDetailView = ({ customer, setView }) => {
  const [formData, setFormData] = useState(customer || {
    username: '', email: '', phone: '', street1: '', street2: '', city: 'Gandhinagar', state: 'Gujarat', country: 'India'
  });

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(VIEWS.CUSTOMER_LIST)} className="text-slate-400 hover:text-teal-600 p-2 hover:bg-teal-50 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-200">{customer ? 'Edit' : 'New'}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Customer</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setView(VIEWS.CUSTOMER_LIST)}>Discard</Button>
          <Button onClick={() => setView(VIEWS.CUSTOMER_LIST)}><Save size={16}/> Save</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex gap-8 mb-8">
          <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-300 hover:text-teal-500 hover:border-teal-400 cursor-pointer relative group transition-all">
            <Camera size={28} />
          </div>
          <div className="flex-1">
            <input type="text" placeholder="e.g. Eric Smith" 
              className="w-full bg-transparent border-b-2 border-slate-200 text-3xl font-black text-slate-900 placeholder:text-slate-300 focus:border-teal-500 outline-none pb-2 mb-8 transition-colors"
              value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Email</label>
                  <div className="relative"><Mail size={16} className="absolute left-3 top-3 text-slate-400"/>
                    <input type="email" placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                  </div>
                </div>
                <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Phone</label>
                  <div className="relative"><Phone size={16} className="absolute left-3 top-3 text-slate-400"/>
                    <input type="text" placeholder="Phone" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1"><MapPin size={12}/> Address</label>
                <input type="text" placeholder="Street 1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                <input type="text" placeholder="Street 2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                <div className="flex gap-2">
                  <input type="text" placeholder="City" className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}/>
                  <select className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none transition-all">
                    <option>Gujarat</option><option>Maharashtra</option><option>Delhi</option>
                  </select>
                  <input type="text" placeholder="ZIP" className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailView;
