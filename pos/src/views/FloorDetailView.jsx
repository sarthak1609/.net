import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Copy, Settings, Plus, Grid } from 'lucide-react';
import Button from '../components/ui/Button';
import { VIEWS } from '../constants';
import { ApiClient } from '../utils/api';

const FloorDetailView = ({ setView }) => {
  const [allTables, setAllTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableFloors, setAvailableFloors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [floorName, setFloorName] = useState("Main Floor");
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  useEffect(() => {
    ApiClient.get('/api/tables')
      .then(data => {
        if (Array.isArray(data)) {
          const processed = data.map(t => ({ ...t, seats: t.capacity, number: t.id.toString(), active: true }));
          setAllTables(processed);
          const floors = [...new Set(processed.map(t => t.floor))].sort((a, b) => a - b);
          setAvailableFloors(floors);
          if (floors.length > 0) setCurrentFloor(floors[0]);
        }
        setLoading(false);
      })
      .catch(err => { console.error("Failed to load tables:", err); setLoading(false); });
  }, []);

  const currentTables = allTables.filter(t => t.floor === currentFloor);

  const handleFloorChange = (e) => {
    const val = e.target.value;
    if (val === "new") {
      const newFloor = availableFloors.length > 0 ? Math.max(...availableFloors) + 1 : 1;
      setAvailableFloors([...availableFloors, newFloor]);
      setCurrentFloor(newFloor);
      setFloorName(`Floor ${newFloor}`);
    } else { setCurrentFloor(parseInt(val)); setFloorName(`Floor ${val}`); }
  };

  const handleSave = async () => {
    try {
      // Filter out temporary IDs (Date.now() based) and prepare batch update
      const tablesToSave = allTables.map(t => ({
        id: t.id,
        floor: t.floor,
        capacity: t.seats,
        number: t.number,
        active: t.active
      }));

      const response = await ApiClient.post('/api/tables/batch', tablesToSave);
      console.log("Tables saved:", response);
      setView(VIEWS.SETTINGS);
    } catch (error) {
      console.error("Failed to save tables:", error);
      alert("Error saving tables: " + error.message);
    }
  };
  const toggleSelectAll = () => { selectedIds.length === currentTables.length ? setSelectedIds([]) : setSelectedIds(currentTables.map(t => t.id)); };
  const toggleSelectRow = (id) => { selectedIds.includes(id) ? setSelectedIds(selectedIds.filter(s => s !== id)) : setSelectedIds([...selectedIds, id]); };
  const handleDelete = () => { setAllTables(allTables.filter(t => !selectedIds.includes(t.id))); setSelectedIds([]); setActionMenuOpen(false); };
  const handleDuplicate = () => { const items = currentTables.filter(t => selectedIds.includes(t.id)).map(t => ({...t, id: Date.now()+Math.random(), number: `${t.number} (Copy)`})); setAllTables([...allTables, ...items]); setSelectedIds([]); setActionMenuOpen(false); };
  const handleAddLine = () => { setAllTables([...allTables, { id: Date.now(), floor: currentFloor, number: "New", seats: 2, active: true }]); };
  const updateTable = (id, field, value) => { setAllTables(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t)); };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView(VIEWS.SETTINGS)} className="text-slate-400 hover:text-teal-600 p-2 hover:bg-teal-50 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Configuration</p>
            <h1 className="text-2xl font-extrabold text-slate-900">Floor Plan</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setView(VIEWS.SETTINGS)}>Discard</Button>
          <Button onClick={handleSave}><Save size={16}/> Save</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Floor Info */}
        <div className="p-8 border-b border-slate-100 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Floor Name</label>
                <select className="bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-medium px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-teal-500" value={currentFloor} onChange={handleFloorChange}>
                  {availableFloors.map(f => (<option key={f} value={f}>Floor {f}</option>))}
                  <option disabled>──────────</option>
                  <option value="new">+ New Floor</option>
                </select>
              </div>
              <input type="text" value={floorName} onChange={(e) => setFloorName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"/>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Point of Sale</label>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none transition-all">
                <option>51Cafe</option><option>Bar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            {selectedIds.length > 0 && (
              <div className="relative">
                <Button variant="secondary" size="sm" onClick={() => setActionMenuOpen(!actionMenuOpen)}><Settings size={14} /> Actions ({selectedIds.length})</Button>
                {actionMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-1.5 animate-scaleIn">
                    <button onClick={handleDuplicate} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2"><Copy size={14}/> Duplicate</button>
                    <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2"><Trash2 size={14}/> Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleAddLine} className="text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-1 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"><Plus size={14}/> Add Table</button>
        </div>

        {/* Table */}
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-xs border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-12 text-center"><input type="checkbox" checked={currentTables.length > 0 && selectedIds.length === currentTables.length} onChange={toggleSelectAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"/></th>
              <th className="px-6 py-4">Table Number</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Loading tables...</td></tr>}
            {!loading && currentTables.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium"><Grid size={32} className="mx-auto mb-2 opacity-30"/>No tables on this floor</td></tr>}
            {currentTables.map((table) => (
              <tr key={table.id} className={`hover:bg-teal-50/20 transition-colors ${selectedIds.includes(table.id) ? 'bg-teal-50/40' : ''}`}>
                <td className="px-4 py-4 text-center"><input type="checkbox" checked={selectedIds.includes(table.id)} onChange={() => toggleSelectRow(table.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"/></td>
                <td className="px-6 py-4"><input type="text" value={table.number} onChange={(e) => updateTable(table.id, 'number', e.target.value)} className="bg-transparent outline-none text-slate-900 font-bold font-mono w-full"/></td>
                <td className="px-6 py-4"><input type="number" value={table.seats} onChange={(e) => updateTable(table.id, 'seats', parseInt(e.target.value))} className="bg-transparent outline-none text-slate-600 w-16"/></td>
                <td className="px-6 py-4">
                  <button onClick={() => updateTable(table.id, 'active', !table.active)} className={`w-11 h-6 rounded-full transition-all ${table.active ? 'bg-teal-600' : 'bg-slate-200'} relative`}>
                    <span className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${table.active ? 'left-[22px]' : 'left-0.5'}`}/>
                  </button>
                </td>
                <td className="px-6 py-4 text-slate-400 font-medium">Seating</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloorDetailView;
