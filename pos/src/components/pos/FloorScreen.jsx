import React, { useState, useEffect } from 'react';
import { User, Coffee } from 'lucide-react';

const FloorScreen = ({ onTableSelect, activeTableId, floors = [] }) => {
  const [activeFloorId, setActiveFloorId] = useState(floors[0]?.id);

  useEffect(() => {
    if (!activeFloorId && floors.length > 0) setActiveFloorId(floors[0].id);
  }, [floors, activeFloorId]);

  const activeFloor = floors.find(f => f.id === activeFloorId) || floors[0];
  if (!activeFloor) return <div className="p-10 text-center text-slate-400 font-medium text-lg">No floors configured yet.</div>;

  return (
    <div className="h-full bg-transparent flex flex-col animate-fadeIn">
      {/* Floor Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 pt-4 flex gap-2 overflow-x-auto shrink-0">
        {floors.map(floor => (
          <button key={floor.id} onClick={() => setActiveFloorId(floor.id)}
            className={`px-6 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
              activeFloorId === floor.id 
                ? 'bg-teal-50 text-teal-700 border-teal-600' 
                : 'text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Coffee size={14} className="inline mr-2 -mt-0.5" />{floor.name}
          </button>
        ))}
      </div>

      {/* Tables */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {activeFloor.tables.map((table) => (
              <button key={table.id} onClick={() => onTableSelect(table)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 group border-2 shadow-sm hover:shadow-md ${
                  activeTableId === table.id 
                    ? 'bg-teal-50 border-teal-500 shadow-teal-100' 
                    : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                }`}
              >
                <span className={`text-4xl font-black mb-1 ${activeTableId === table.id ? 'text-teal-600' : 'text-slate-800 group-hover:text-teal-600'} transition-colors`}>
                  {table.number}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-1">
                  <User size={11} /><span>{table.seats} seats</span>
                </div>
                <div className={`absolute bottom-3 w-2.5 h-2.5 rounded-full ${table.active ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`}></div>
              </button>
            ))}
            {activeFloor.tables.length === 0 && (
              <div className="col-span-full text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">
                No tables on this floor. Configure in Settings.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorScreen;
