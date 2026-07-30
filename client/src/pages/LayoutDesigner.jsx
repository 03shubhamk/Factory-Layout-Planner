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
  Compass,
  Play,
  Pause,
  Flame,
  Zap,
  FastForward,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import PRESET_TEMPLATES from '../utils/presetTemplates';

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
  
  // Interactive Simulation & Heatmap States
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1, 2, 4
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  // Track dragging & panning state
  const [draggingMachineId, setDraggingMachineId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridContainerRef = useRef(null);
  const canvasViewportRef = useRef(null);
  
  // Canvas Viewport Panning States
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Load Preset Industry Template Handler with proportional grid scaling
  const handleLoadPresetTemplate = async (template) => {
    if (!activeFactory) return;
    setShowPresetMenu(false);

    if (machines.length > 0) {
      const confirmClear = window.confirm(`Loading "${template.name}" will clear all existing placed nodes. Proceed?`);
      if (!confirmClear) return;
      
      // Delete existing machines sequentially
      for (const m of machines) {
        await deleteMachine(m.id);
      }
    }

    const scaleX = (activeFactory.length - 8) / template.defaultDimensions.length;
    const scaleY = (activeFactory.width - 8) / template.defaultDimensions.width;

    const createdIds = [];
    for (const mDef of template.machines) {
      const scaledX = Math.round(Math.max(2, Math.min(activeFactory.length - 4, mDef.x * scaleX + 2)) * 2) / 2;
      const scaledY = Math.round(Math.max(2, Math.min(activeFactory.width - 4, mDef.y * scaleY + 2)) * 2) / 2;

      const newM = await addMachine({
        machineName: mDef.machineName,
        machineType: mDef.machineType,
        x: scaledX,
        y: scaledY,
        orientation: mDef.orientation,
        status: mDef.status,
        throughput: mDef.throughput,
        health: mDef.health,
        load: mDef.load
      });
      if (newM && newM.id) {
        createdIds.push(newM.id);
      }
    }

    if (createdIds.length > 0) {
      await saveFlow(createdIds);
    }
  };

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

  // Canvas Panning Handlers
  const handleCanvasMouseDown = (e) => {
    if (e.target === gridContainerRef.current || e.target.tagName === 'svg' || e.target.classList.contains('blueprint-grid')) {
      setIsPanningCanvas(true);
      if (canvasViewportRef.current) {
        setPanStart({
          x: e.clientX,
          y: e.clientY,
          scrollLeft: canvasViewportRef.current.scrollLeft,
          scrollTop: canvasViewportRef.current.scrollTop
        });
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanningCanvas && canvasViewportRef.current) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      canvasViewportRef.current.scrollLeft = panStart.scrollLeft - dx;
      canvasViewportRef.current.scrollTop = panStart.scrollTop - dy;
    } else {
      handleGridMouseMove(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanningCanvas(false);
    handleGridMouseUp();
  };

  // Zoom options
  const handleZoom = (direction) => {
    if (direction === 'in') setZoomLevel(prev => Math.min(2.5, prev + 0.1));
    if (direction === 'out') setZoomLevel(prev => Math.max(0.4, prev - 0.1));
    if (direction === 'reset') {
      setZoomLevel(0.85);
      if (canvasViewportRef.current) {
        canvasViewportRef.current.scrollLeft = 0;
        canvasViewportRef.current.scrollTop = 0;
      }
    }
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

  // Grid background style based on zoom and physical factory dimensions
  const baseScale = Math.max(14, Math.min(22, 900 / (activeFactory?.length || 50)));
  const gridWidthPx = Math.max(500, (activeFactory?.length || 50) * baseScale * zoomLevel);

  const gridStyle = {
    width: `${gridWidthPx}px`,
    aspectRatio: `${activeFactory.length} / ${activeFactory.width}`,
    position: 'relative',
    flexShrink: 0
  };

  // Bounding Helpers: Ensures machine nodes stay 100% inside the visible blueprint grid
  const getMachX = (m) => Math.max(1, Math.min(activeFactory.length - 2.5, m.x));
  const getMachY = (m) => Math.max(1, Math.min(activeFactory.width - 2.2, m.y));

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
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Grid Header Toolbar */}
          <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10 shadow-sm shrink-0 overflow-x-auto overflow-y-hidden gap-2">
            
            {/* Left Section: Grid Info & Presets */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Grid Size Badge */}
              <span className="h-8 px-2.5 bg-slate-100/90 text-slate-700 font-mono border border-slate-200/80 rounded-lg text-xs font-semibold flex items-center shrink-0 whitespace-nowrap">
                GRID: {activeFactory.length}×{activeFactory.width}m
              </span>

              {/* Snap Toggle Button */}
              <button 
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`h-8 px-2.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center shrink-0 whitespace-nowrap ${
                  snapToGrid 
                    ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-2xs' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                SNAP: {snapToGrid ? 'ON' : 'OFF'}
              </button>

              {/* Preset Industry Layouts Dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowPresetMenu(!showPresetMenu)}
                  className="h-8 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Presets</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {showPresetMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-2 space-y-1 font-sans">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                      Industry Presets
                    </div>
                    {PRESET_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => handleLoadPresetTemplate(tmpl)}
                        className="w-full text-left p-2 rounded-md hover:bg-blue-50 transition-all flex items-start gap-2.5 group"
                      >
                        <span className="text-lg">{tmpl.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-primary flex items-center justify-between">
                            <span>{tmpl.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded font-mono">
                              {tmpl.machines.length} Nodes
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {tmpl.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Simulation, Heatmap & Zoom */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`h-8 px-3 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                  isSimulating 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>SIMULATING</span>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>START SIM</span>
                  </>
                )}
              </button>

              {/* Speed Buttons Segmented Pill */}
              <div className="h-8 flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200 shrink-0">
                {[1, 2, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => setSimSpeed(s)}
                    className={`h-7 px-2 text-[10px] font-mono font-bold rounded-md transition-all flex items-center justify-center ${
                      simSpeed === s 
                        ? 'bg-white text-slate-900 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Heatmap Toggle */}
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`h-8 px-3 rounded-lg text-xs font-bold font-sans transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                  showHeatmap 
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'fill-current' : ''}`} />
                <span>HEATMAP</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5"></div>

              {/* Zoom Buttons Group */}
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={() => handleZoom('in')}
                  title="Zoom In"
                  className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 bg-white transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleZoom('out')}
                  title="Zoom Out"
                  className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 bg-white transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleZoom('reset')}
                  title="Fit Screen"
                  className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 bg-white transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid Layout Canvas Viewport */}
          <div 
            ref={canvasViewportRef}
            onMouseDown={handleCanvasMouseDown}
            className={`flex-1 overflow-auto p-8 flex bg-slate-200/70 select-none min-h-0 min-w-0 ${
              isPanningCanvas ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) handleZoom('in');
                else handleZoom('out');
              }
            }}
          >
            <div 
              ref={gridContainerRef}
              style={gridStyle}
              className="blueprint-grid border-2 border-slate-300 shadow-md rounded-lg relative overflow-hidden m-auto"
            >
              {/* Grid visual coordinate coordinates labels */}
              <div className="absolute top-1 left-2 text-[10px] font-mono text-slate-300 pointer-events-none">
                0,0
              </div>
              <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-300 pointer-events-none">
                {activeFactory.length},{activeFactory.width}
              </div>

              {/* Interactive Heatmap SVG Gradients Definition */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-medium" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-low" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="flow-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>

                {/* Render Heatmap Halos if Enabled */}
                {showHeatmap && machines.map((m) => {
                  const cxPct = ((getMachX(m) + 1.2) / activeFactory.length) * 100;
                  const cyPct = ((getMachY(m) + 1) / activeFactory.width) * 100;
                  const heatRadiusPct = (8 / activeFactory.length) * 100;
                  
                  // Heat level color based on machine load and health
                  const isHighFriction = m.health !== 'Optimal' || m.load > 85;
                  const gradId = isHighFriction ? 'heat-high' : m.load > 60 ? 'heat-medium' : 'heat-low';

                  return (
                    <circle
                      key={`heat-${m.id}`}
                      cx={`${cxPct}%`}
                      cy={`${cyPct}%`}
                      r={`${heatRadiusPct}%`}
                      fill={`url(#${gradId})`}
                      className="animate-pulse-glow"
                    />
                  );
                })}

                {/* Production Path Flow Connections & Animated Material Cargo */}
                {flow.length >= 2 && flow.map((step, idx) => {
                  if (idx === flow.length - 1) return null;
                  const nextStep = flow[idx + 1];
                  
                  const machA = machines.find(m => m.id === step.machineId);
                  const machB = machines.find(m => m.id === nextStep.machineId);

                  if (machA && machB) {
                    // Center of machine nodes (in pixels / percentages)
                    const px1 = ((getMachX(machA) + 1.2) / activeFactory.length) * 100;
                    const py1 = ((getMachY(machA) + 1) / activeFactory.width) * 100;
                    const px2 = ((getMachX(machB) + 1.2) / activeFactory.length) * 100;
                    const py2 = ((getMachY(machB) + 1) / activeFactory.width) * 100;

                    const x1 = `${px1}%`;
                    const y1 = `${py1}%`;
                    const x2 = `${px2}%`;
                    const y2 = `${py2}%`;

                    // Calculate Manhattan Distance
                    const dist = Math.abs(machB.x - machA.x) + Math.abs(machB.y - machA.y);
                    const isLongTravel = dist > 15;
                    const lineColor = isLongTravel ? '#F59E0B' : '#2563EB';

                    // SVG path d string for animateMotion
                    const pathD = `M ${px1} ${py1} L ${px2} ${py2}`;

                    // Duration based on speed and machine throughput
                    const baseDuration = Math.max(1, 5 / (simSpeed * (machA.throughput / 100)));

                    return (
                      <g key={`${step.id}-${idx}`}>
                        {/* Heatmap overlay line for long distance */}
                        {showHeatmap && isLongTravel && (
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#EF4444"
                            strokeWidth="8"
                            strokeOpacity="0.3"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Outer glow stroke line */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={lineColor}
                          strokeWidth="3"
                          strokeOpacity="0.4"
                        />

                        {/* Animated dashed line */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={lineColor}
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          className={isSimulating ? "animate-flow-dash" : ""}
                        />

                        {/* Step Connection Endpoint Circles */}
                        <circle cx={x1} cy={y1} r="4" fill={lineColor} />
                        <circle cx={x2} cy={y2} r="4" fill={lineColor} />

                        {/* Distance Label Badge on Midpoint */}
                        <g transform={`translate(${(px1 + px2) / 2}, ${(py1 + py2) / 2})`}>
                          <rect
                            x="-16"
                            y="-9"
                            width="32"
                            height="14"
                            rx="3"
                            fill="#1E293B"
                            fillOpacity="0.8"
                          />
                          <text
                            x="0"
                            y="1"
                            fill="#F8FAFC"
                            fontSize="8"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {dist.toFixed(1)}m
                          </text>
                        </g>

                        {/* Animated Cargo Crate Particles Gliding along Path */}
                        {isSimulating && machA.status === 'Running' && (
                          <g>
                            {/* Glowing Particle Circle */}
                            <circle r="4" fill="#3B82F6">
                              <animateMotion
                                path={pathD}
                                dur={`${baseDuration}s`}
                                repeatCount="indefinite"
                              />
                            </circle>
                            {/* Cargo Icon Particle */}
                            <text
                              fontSize="10"
                              textAnchor="middle"
                              dy="3"
                              className="select-none pointer-events-none"
                            >
                              📦
                              <animateMotion
                                path={pathD}
                                dur={`${baseDuration}s`}
                                repeatCount="indefinite"
                              />
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>

              {/* Heatmap & Simulation HUD Floating Overlay */}
              <div className="absolute bottom-3 left-3 z-30 flex flex-col gap-2 pointer-events-none">
                {showHeatmap && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white p-2.5 rounded-lg text-[10px] font-mono space-y-1 shadow-lg pointer-events-auto">
                    <div className="font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Flame className="w-3 h-3 text-amber-400 fill-current" />
                      <span>Friction Heatmap</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Low Travel (&lt;10m)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Moderate (10-15m)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span>High Friction (&gt;15m)</span>
                    </div>
                  </div>
                )}

                {isSimulating && (
                  <div className="bg-emerald-950/80 backdrop-blur-sm border border-emerald-600/50 text-emerald-300 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE SIMULATION ({simSpeed}X) — MATERIAL FLOW ACTIVE</span>
                  </div>
                )}
              </div>

              {/* Render placed machines */}
              {machines.map((mach) => {
                const isSelected = mach.id === selectedMachineId;
                const isDragging = mach.id === draggingMachineId;

                const posX = getMachX(mach);
                const posY = getMachY(mach);

                // Position machine absolutely inside the grid container using percentages
                const machinePositionStyle = {
                  left: `${(posX / activeFactory.length) * 100}%`,
                  top: `${(posY / activeFactory.width) * 100}%`,
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

              {/* Operational & Health Controls */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Status</span>
                
                {/* Status Toggle */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Live Machine Status</label>
                  <select
                    value={selectedMachine.status}
                    onChange={(e) => updateMachine(selectedMachine.id, { status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="Running">🟢 Running (Active Particle Flow)</option>
                    <option value="Idle">⚪ Idle (Standby)</option>
                    <option value="Maintenance">🔴 Maintenance Required</option>
                  </select>
                </div>

                {/* Health Toggle */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Health State</label>
                  <select
                    value={selectedMachine.health}
                    onChange={(e) => updateMachine(selectedMachine.id, { health: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="Optimal">Optimal Performance</option>
                    <option value="Maintenance Required">Maintenance Required (High Friction)</option>
                  </select>
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
