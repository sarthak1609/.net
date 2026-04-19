import React, { useState,userEffect } from 'react';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import Button from '../components/ui/Button';
// import { VIEWS } from '../constants';

const CustomerDetailView = ({ customer, setView }) => {
  const [formData, setFormData] = useState(customer || {
    name: '', email: '', phone: '', street1: '', street2: '', city: 'Gandhinagar', state: 'Gujarat', country: 'India'
  });
 
  

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(VIEWS.CUSTOMER_LIST)} className="text-gray-500 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded border border-teal-400">New</span>
             <h1 className="text-2xl font-bold text-gray-900">Customer</h1>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setView(VIEWS.CUSTOMER_LIST)}>Discard</Button>
            <Button onClick={() => setView(VIEWS.CUSTOMER_LIST)}><Save size={16}/> Save</Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 shadow-xl">
        <div className="flex gap-8 mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-slate-600 text-gray-500 hover:text-gray-900 cursor-pointer relative group">
                <Camera size={32} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity text-xs text-gray-900">Upload</div>
            </div>
            <div className="flex-1">
                 <input 
                    type="text" 
                    placeholder="e.g. Eric Smith" 
                    className="w-full bg-transparent border-b border-slate-600 text-3xl font-bold text-gray-900 placeholder-slate-600 focus:border-teal-500 outline-none pb-2 mb-6 transition-colors"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                 />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1">
                            <input 
                                type="email" 
                                placeholder="Email"
                                className="w-full bg-white shadow-sm border border-slate-600 rounded px-3 py-2 text-gray-900 focus:border-teal-500 outline-none"
                                value={formData.email}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <input 
                                type="text" 
                                placeholder="Phone"
                                className="w-full bg-white shadow-sm border border-slate-600 rounded px-3 py-2 text-gray-900 focus:border-teal-500 outline-none"
                                value={formData.phone}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <label className="block text-gray-500 font-medium mb-1">Address</label>
                        <input type="text" placeholder="Street 1..." className="w-full bg-transparent border-b border-slate-600 text-gray-700 focus:border-teal-500 outline-none py-1" />
                        <input type="text" placeholder="Street 2..." className="w-full bg-transparent border-b border-slate-600 text-gray-700 focus:border-teal-500 outline-none py-1" />
                        <div className="flex gap-2">
                             <input type="text" placeholder="City" className="w-1/3 bg-transparent border-b border-slate-600 text-gray-700 focus:border-teal-500 outline-none py-1" value={formData.city}/>
                             <div className="relative w-1/3">
                                 <select className="w-full bg-transparent border-b border-slate-600 text-gray-700 focus:border-teal-500 outline-none py-1 appearance-none cursor-pointer">
                                     <option>Gujarat</option>
                                     <option>Maharashtra</option>
                                     <option>Delhi</option>
                                 </select>
                                 <span className="absolute right-0 top-1 text-gray-500 text-xs">▼</span>
                             </div>
                             <input type="text" placeholder="ZIP" className="w-1/3 bg-transparent border-b border-slate-600 text-gray-700 focus:border-teal-500 outline-none py-1" />
                        </div>
                        <input type="text" placeholder="Country" className="w-full bg-transparent border-b border-slate-600 text-gray-700 focus:border-teal-500 outline-none py-1" value={formData.country}/>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailView;
