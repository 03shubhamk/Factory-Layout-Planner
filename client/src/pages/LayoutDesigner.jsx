import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  HelpCircle, 
  Check, 
  Layers,
  Wrench,
  Activity,
  Compass
} from 'lucide-react';

export default function LayoutDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    activeFactory, 
    machines, 
    flow, 
    loadFactoryDetails, 
    addMachine, 
    updateMachine, 
    deleteMachine,
    saveFlow 
  } = useFactory();

  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Scale multiplier
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Track dragging state
  const [draggingMachineId, setDraggingMachineId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridContainerRef = useRef(null);

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id]);

  // Selected Machine object helper
  const selectedMachine = machines.find(m => m.id === selectedMachineId);

  // List of machine library templates
  const machineTemplates = [
    { name: 'Raw Material', type: 'Input', color: '#3B82F6', icon: '📦' },
    { name: 'Cutting Station', type: 'Processing', color: '#EF4444', icon: '✂️' },
    { name: 'Drilling Unit', type: 'Processing', color: '#F59E0B', icon: '⚙️' },
    { name: 'Assembly Line', type: 'Assembly', color: '#10B981', icon: '🤝' },
    { name: 'Quality Check', type: 'Quality', color: '#8B5CF6', icon: '🔍' },
    { name: 'Packaging', type: 'Logistics', color: '#EC4899', icon: '🗳️' },
    { name: 'Warehouse', type: 'Logistics', color: '#64748B', icon: '🏢' },
    { name: 'Storage Area', type: 'Storage', color: '#06B6D4', icon: '🗄️' },
  ];

  // Add machine to grid from template
  const handleAddTemplate = async (template) => {
    if (!activeFactory) return;
    
    // Spawn machine near center of grid
    const spawnX = Math.round(activeFactory.length / 2);
    const spawnY = Math.round(activeFactory.width / 2);

    const newMachine = await addMachine({
      machineName: `${template.name} ${machines.filter(m => m.machineName.startsWith(template.name)).length + 1}`,
      machineType: template.type,
      x: spawnX,
      y: spawnY,
      orientation: 0,
      status: 'Idle',
      throughput: template.type === 'Processing' ? 142 : 100,
      health: 'Optimal',
      load: 50
    });

    if (newMachine) {
      setSelectedMachineId(newMachine.id);
    }
  };

  // Delete machine
  const handleDeleteSelected = async () => {
    if (selectedMachineId) {
      await deleteMachine(selectedMachineId);
      setSelectedMachineId(null);
    }
  };

  // Dragging event handlers
  const handleGridMouseDown = (e, mach) => {
    e.stopPropagation();
    setSelectedMachineId(mach.id);
    setDraggingMachineId(mach.id);
    
    // Calculate mouse position relative to machine top-left in meters
    const gridRect = gridContainerRef.current.getBoundingClientRect();
    const meterScale = (gridRect.width / activeFactory.length) * zoomLevel;
    
    const clickXMeters = (e.clientX - gridRect.left) / (gridRect.width / activeFactory.length);
    const clickYMeters = (e.clientY - gridRect.top) / (gridRect.height / activeFactory.width);

    setDragOffset({
      x: clickXMeters - mach.x,
      y: clickYMeters - mach.y
    });
  };

  const handleGridMouseMove = (e) => {
    if (!draggingMachineId || !activeFactory) return;

    const gridRect = gridContainerRef.current.getBoundingClientRect();
    
    // Total physical size mapped to pixels
    const pxPerMeterX = gridRect.width / activeFactory.length;
    const pxPerMeterY = gridRect.height / activeFactory.width;

    // Mouse coordinates in meters
    const mouseXMeters = (e.clientX - gridRect.left) / pxPerMeterX;
    const mouseYMeters = (e.clientY - gridRect.top) / pxPerMeterY;

    let newX = mouseXMeters - dragOffset.x;
    let newY = mouseYMeters - dragOffset.y;

    // Snap to 1m or 0.5m grid
    if (snapToGrid) {
      newX = Math.round(newX * 2) / 2; // 0.5m snap
      newY = Math.round(newY * 2) / 2;
    }

    // Clamp coordinates to factory boundaries (offsetting for machine visual width of 3mx3m)
    newX = Math.max(1, Math.min(activeFactory.length - 2, newX));
    newY = Math.max(1, Math.min(activeFactory.width - 2, newY));

    updateMachine(draggingMachineId, { x: newX, y: newY });
  };

  const handleGridMouseUp = () => {
    setDraggingMachineId(null);
  };

  // Zoom options
  const handleZoom = (direction) => {
    if (direction === 'in') setZoomLevel(prev => Math.min(2, prev + 0.1));
    if (direction === 'out') setZoomLevel(prev => Math.max(0.6, prev - 0.1));
    if (direction === 'reset') setZoomLevel(1);
  };

  // Reset all layout machines
  const handleResetLayout = () => {
    if (window.confirm('Are you sure you want to clear this factory layout? All placed machines will be deleted.')) {
      machines.forEach(async (m) => {
        await deleteMachine(m.id);
      });
      setSelectedMachineId(null);
    }
  };

  // Save changes & Calculate Layout (Navigates to flow page first to define flow if empty, else analysis)
  const handleCalculateLayout = async () => {
    if (!activeFactory) return;
    
    if (flow.length === 0 && machines.length > 0) {
      // Prompt defining flow path
      navigate(`/flow/${activeFactory.id}`);
    } else {
      navigate(`/analysis/${activeFactory.id}`);
    }
  };

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Grid background style based on zoom
  const gridStyle = {
    width: `${100 * zoomLevel}%`,
    aspectRatio: `${activeFactory.length} / ${activeFactory.width}`,
    position: 'relative'
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100">
      {/* Designer Content Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Machine Library */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-sm">Machine Library</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Click templates to insert onto the grid.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Library list grouped by categories */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Production</span>
                <div className="grid grid-cols-1 gap-2">
                  {machineTemplates.filter(t => t.type === 'Input' || t.type === 'Processing' || t.type === 'Assembly').map((template) => (
                    <button
                      key={template.name}
                      onClick={() => handleAddTemplate(template)}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-primary/30 hover:bg-blue-50/20 text-left transition-all text-xs font-semibold text-slate-700"
                    >
                      <span className="text-base">{template.icon}</span>
                      <span>{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Logistics & Storage</span>
                <div className="grid grid-cols-1 gap-2">
                  {machineTemplates.filter(t => t.type === 'Logistics' || t.type === 'Storage' || t.type === 'Quality').map((template) => (
                    <button
                      key={template.name}
                      onClick={() => handleAddTemplate(template)}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-primary/30 hover:bg-blue-50/20 text-left transition-all text-xs font-semibold text-slate-700"
                    >
                      <span className="text-base">{template.icon}</span>
                      <span>{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Factory Floor Designer Grid */}
        <main 
          className="flex-1 flex flex-col overflow-hidden relative"
          onMouseMove={handleGridMouseMove}
          onMouseUp={handleGridMouseUp}
          onMouseLeave={handleGridMouseUp}
        >
          {/* Grid Header Toolbar */}
          <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-4 text-xs font-mono font-semibold text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                GRID SIZE: {activeFactory.length}×{activeFactory.width}m
              </span>
              <button 
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`px-2 py-0.5 rounded transition-all ${
                  snapToGrid 
                    ? 'bg-blue-50 text-primary border border-blue-100' 
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                SNAP: {snapToGrid ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Grid zoom actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleZoom('in')}
                title="Zoom In"
                className="p-1.5 hover:bg-slate-100 rounded-md border border-slate-200 text-slate-600 bg-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleZoom('out')}
                title="Zoom Out"
                className="p-1.5 hover:bg-slate-100 rounded-md border border-slate-200 text-slate-600 bg-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleZoom('reset')}
                title="Fit Screen"
                className="p-1.5 hover:bg-slate-100 rounded-md border border-slate-200 text-slate-600 bg-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid Layout Canvas */}
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-100 select-none">
            <div 
              ref={gridContainerRef}
              style={gridStyle}
              className="blueprint-grid border-2 border-slate-300 shadow-soft rounded-lg relative overflow-hidden"
            >
              {/* Grid visual coordinate coordinates labels */}
              <div className="absolute top-1 left-2 text-[10px] font-mono text-slate-300 pointer-events-none">
                0,0
              </div>
              <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-300 pointer-events-none">
                {activeFactory.length},{activeFactory.width}
              </div>

              {/* Draw production path connections overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {flow.length >= 2 && flow.map((step, idx) => {
                  if (idx === flow.length - 1) return null;
                  const nextStep = flow[idx + 1];
                  
                  const machA = machines.find(m => m.id === step.machineId);
                  const machB = machines.find(m => m.id === nextStep.machineId);

                  if (machA && machB) {
                    // Convert physical coordinates to percentage positions
                    const pctAX = (machA.x / activeFactory.length) * 100;
                    const pctAY = (machB.y / activeFactory.width) * 100; // wait, make sure matching the coordinates center
                    
                    // Center of machine nodes (which is roughly 2.5m wide)
                    const x1 = `${((machA.x + 1.2) / activeFactory.length) * 100}%`;
                    const y1 = `${((machA.y + 1) / activeFactory.width) * 100}%`;
                    const x2 = `${((machB.x + 1.2) / activeFactory.length) * 100}%`;
                    const y2 = `${((machB.y + 1) / activeFactory.width) * 100}%`;

                    return (
                      <g key={`${step.id}-${idx}`}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeDasharray="6,4"
                          className="animate-[dash_10s_linear_infinite]"
                        />
                        <circle cx={x1} cy={y1} r="3" fill="#2563EB" />
                        <circle cx={x2} cy={y2} r="3" fill="#2563EB" />
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>

              {/* Render placed machines */}
              {machines.map((mach) => {
                const isSelected = mach.id === selectedMachineId;
                const isDragging = mach.id === draggingMachineId;

                // Position machine absolutely inside the grid container using percentages
                const machinePositionStyle = {
                  left: `${(mach.x / activeFactory.length) * 100}%`,
                  top: `${(mach.y / activeFactory.width) * 100}%`,
                  width: `${(2.4 / activeFactory.length) * 100}%`, // ~2.4m width visual size
                  height: `${(2.0 / activeFactory.width) * 100}%`, // ~2m height visual size
                  transform: `rotate(${mach.orientation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.2s, left 0.1s, top 0.1s'
                };

                return (
                  <div
                    key={mach.id}
                    onMouseDown={(e) => handleGridMouseDown(e, mach)}
                    style={machinePositionStyle}
                    className={`absolute rounded border flex flex-col items-center justify-center cursor-move transition-all select-none z-20 shadow-sm ${
                      isSelected 
                        ? 'border-primary bg-blue-50 ring-2 ring-primary/20' 
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    {/* Machine ID Tag */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-bold font-mono px-1 rounded border border-slate-700 pointer-events-none whitespace-nowrap">
                      {mach.machineName.split(' ')[0].substring(0, 4)}-{mach.machineName.split(' ')[1] || '01'}
                    </div>

                    {/* Machine Status Dot */}
                    <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                      mach.status === 'Running' ? 'bg-success animate-pulse' : 'bg-slate-400'
                    }`}></div>

                    {/* Asset Graphic/Icon */}
                    <span className="text-sm">
                      {mach.machineType === 'Input' ? '📦' :
                       mach.machineType === 'Processing' ? '⚙️' :
                       mach.machineType === 'Assembly' ? '🤝' :
                       mach.machineType === 'Logistics' ? '🗳️' : '🔍'}
                    </span>
                    
                    {/* Compact Label */}
                    <span className="text-[7px] text-slate-500 font-bold font-mono truncate w-full text-center px-1">
                      M{machines.indexOf(mach) + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right Side: Property Inspector Panel */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-sm">Inspector</h2>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Modify selected machine parameters.</p>
          </div>

          {selectedMachine ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Machine Identity */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Machine Identity</span>
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Machine Name</label>
                  <input
                    type="text"
                    value={selectedMachine.machineName}
                    onChange={(e) => updateMachine(selectedMachine.id, { machineName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Machine Type</label>
                  <select
                    value={selectedMachine.machineType}
                    onChange={(e) => updateMachine(selectedMachine.id, { machineType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="Input">Input (Raw Material)</option>
                    <option value="Processing">Processing (Cutting/Drilling)</option>
                    <option value="Assembly">Assembly</option>
                    <option value="Quality">Quality Check</option>
                    <option value="Logistics">Logistics (Packaging/Warehouse)</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>
              </div>

              {/* Spatial Data */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spatial Data</span>
                
                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Position X</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedMachine.x}
                        onChange={(e) => updateMachine(selectedMachine.id, { x: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded pl-2.5 pr-6 py-1.5 text-xs font-mono font-semibold text-slate-800 outline-none"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">m</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Position Y</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedMachine.y}
                        onChange={(e) => updateMachine(selectedMachine.id, { y: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded pl-2.5 pr-6 py-1.5 text-xs font-mono font-semibold text-slate-800 outline-none"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">m</span>
                    </div>
                  </div>
                </div>

                {/* Orientation Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] text-slate-500 font-bold">Orientation</label>
                    <span className="text-[10px] font-mono font-bold text-slate-600">{selectedMachine.orientation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="270"
                    step="90"
                    value={selectedMachine.orientation}
                    onChange={(e) => updateMachine(selectedMachine.id, { orientation: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[7px] text-slate-400 font-mono font-bold mt-1 px-1">
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                    <span>270°</span>
                  </div>
                </div>
              </div>

              {/* Simulated KPIs */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Simulated KPI</span>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>Throughput</span>
                  <span className="font-mono text-primary">{selectedMachine.throughput} u/h</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    style={{ width: `${Math.min(100, (selectedMachine.throughput / 200) * 100)}%` }} 
                    className="bg-primary h-1.5 rounded-full"
                  ></div>
                </div>
              </div>

              {/* Illustrative blueprint block at bottom */}
              <div className="border-t border-slate-100 pt-6 flex flex-col items-center">
                <div className="w-full h-28 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden">
                  {/* Stylized custom SVG blueprint machine vector representation */}
                  <svg className="w-16 h-16 text-slate-300 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent"></div>
                </div>
                <span className="text-[8px] font-mono text-slate-400 font-bold tracking-wider mt-2">
                  NODE ASSET {selectedMachine.machineName.toUpperCase().replace(' ', '-')}-V4
                </span>
              </div>

              {/* Delete Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Machine
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Compass className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">No node selected</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                Click on any placed machine in the grid to inspect and adjust properties.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom Action Footer Bar */}
      <footer className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Editing Layout: <span className="text-slate-800">{activeFactory.name}</span></span>
          <span className="text-slate-300 mx-2">|</span>
          <span className="font-mono text-[10px] text-slate-400">Nodes placed: {machines.length}</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleResetLayout}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-all text-xs font-bold"
          >
            Reset
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-all text-xs font-bold"
          >
            Save Layout
          </button>
          <button
            onClick={handleCalculateLayout}
            disabled={machines.length === 0}
            className="px-6 py-2 bg-warning hover:bg-amber-600 text-white rounded transition-all text-xs font-extrabold shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Layout
          </button>
        </div>
      </footer>
    </div>
  );
}
