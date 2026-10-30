import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  Trash2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers,
  Wrench,
  Activity,
  Compass,
  Play,
  Pause,
  Flame,
  Zap,
  Sparkles,
  ChevronDown,
  Radio,
  Shield,
  Sun,
  Moon,
  Move,
  Box,
  Cpu,
  ShieldCheck,
  Package,
  Boxes,
  Database,
  Crosshair
} from 'lucide-react';
import PRESET_TEMPLATES from '../utils/presetTemplates';
import { useTelemetry } from '../context/TelemetryContext';
import LiveTelemetryBadge from '../components/LiveTelemetryBadge';
import MachineTelemetryDrawer from '../components/MachineTelemetryDrawer';
import MachineSchematic from '../components/MachineSchematic';
import { TopRuler, LeftRuler } from '../components/CADRuler';
import FactoryMinimap from '../components/FactoryMinimap';
import { getOrthogonalPath } from '../utils/flowRouting';

// Proportional CAD footprints per machine classification (in meters)
const getMachineDimensions = (type) => {
  switch (type) {
    case 'Input': return { w: 3.4, h: 2.4 };
    case 'Processing': return { w: 3.8, h: 2.8 };
    case 'Assembly': return { w: 3.6, h: 3.0 };
    case 'Quality': return { w: 3.2, h: 2.4 };
    case 'Logistics': return { w: 4.4, h: 2.4 };
    case 'Storage': return { w: 4.2, h: 2.6 };
    default: return { w: 3.4, h: 2.4 };
  }
};

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

  const { telemetryByMachine } = useTelemetry();

  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [inspectingMachine, setInspectingMachine] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // High-Tech Canvas Customizations
  const [canvasTheme, setCanvasTheme] = useState('dark'); // 'dark' (Digital Twin) | 'light' (CAD Blueprint)
  const [showSafetyZones, setShowSafetyZones] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'pan'
  
  // Interactive Simulation & Heatmap States
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  // Mouse & Panning State
  const [cursorPos, setCursorPos] = useState({ x: null, y: null });
  const [draggingMachineId, setDraggingMachineId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridContainerRef = useRef(null);
  const canvasViewportRef = useRef(null);
  
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id, loadFactoryDetails]);

  const handleLoadPresetTemplate = async (template) => {
    if (!activeFactory) return;
    setShowPresetMenu(false);

    if (machines.length > 0) {
      const confirmClear = window.confirm(`Loading "${template.name}" will clear all existing placed nodes. Proceed?`);
      if (!confirmClear) return;
      for (const m of machines) {
        await deleteMachine(m.id);
      }
    }

    const scaleX = (activeFactory.length - 8) / template.defaultDimensions.length;
    const scaleY = (activeFactory.width - 8) / template.defaultDimensions.width;

    const createdIds = [];
    for (const mDef of template.machines) {
      const scaledX = Math.round(Math.max(2, Math.min(activeFactory.length - 5, mDef.x * scaleX + 2)) * 2) / 2;
      const scaledY = Math.round(Math.max(2, Math.min(activeFactory.width - 5, mDef.y * scaleY + 2)) * 2) / 2;

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

  const selectedMachine = machines.find(m => m.id === selectedMachineId);

  // Machine Library with Vector Icons
  const machineTemplates = [
    { name: 'Raw Material Dock', type: 'Input', category: 'Production', icon: Box, w: 3.4, h: 2.4 },
    { name: 'Precision CNC Mill', type: 'Processing', category: 'Production', icon: Cpu, w: 3.8, h: 2.8 },
    { name: 'Drilling & Boring Unit', type: 'Processing', category: 'Production', icon: Wrench, w: 3.8, h: 2.8 },
    { name: 'Robotic Welding Cell', type: 'Assembly', category: 'Production', icon: Zap, w: 3.6, h: 3.0 },
    { name: 'Manual Assembly Bench', type: 'Assembly', category: 'Production', icon: Layers, w: 3.6, h: 2.6 },
    { name: 'Optical CMM Inspection', type: 'Quality', category: 'Logistics & Storage', icon: ShieldCheck, w: 3.2, h: 2.4 },
    { name: 'Automated Packaging', type: 'Logistics', category: 'Logistics & Storage', icon: Package, w: 4.4, h: 2.4 },
    { name: 'High-Bay ASRS Racks', type: 'Storage', category: 'Logistics & Storage', icon: Boxes, w: 4.2, h: 2.6 },
    { name: 'Buffer Staging Zone', type: 'Storage', category: 'Logistics & Storage', icon: Database, w: 4.0, h: 2.6 }
  ];

  const handleAddTemplate = async (template) => {
    if (!activeFactory) return;
    const spawnX = Math.round(activeFactory.length / 2);
    const spawnY = Math.round(activeFactory.width / 2);

    const newMachine = await addMachine({
      machineName: `${template.name.split(' ')[0]} ${machines.filter(m => m.machineName.startsWith(template.name.split(' ')[0])).length + 1}`,
      machineType: template.type,
      x: spawnX,
      y: spawnY,
      orientation: 0,
      status: 'Idle',
      throughput: template.type === 'Processing' ? 140 : 100,
      health: 'Optimal',
      load: 50
    });

    if (newMachine) {
      setSelectedMachineId(newMachine.id);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMachineId) {
      await deleteMachine(selectedMachineId);
      setSelectedMachineId(null);
    }
  };

  // Dragging event handlers
  const handleGridMouseDown = (e, mach) => {
    e.stopPropagation();
    if (activeTool === 'pan') return;

    setSelectedMachineId(mach.id);
    setDraggingMachineId(mach.id);
    
    const gridRect = gridContainerRef.current.getBoundingClientRect();
    const clickXMeters = (e.clientX - gridRect.left) / (gridRect.width / activeFactory.length);
    const clickYMeters = (e.clientY - gridRect.top) / (gridRect.height / activeFactory.width);

    setDragOffset({
      x: clickXMeters - mach.x,
      y: clickYMeters - mach.y
    });
  };

  const handleGridMouseMove = (e) => {
    if (!gridContainerRef.current || !activeFactory) return;

    const gridRect = gridContainerRef.current.getBoundingClientRect();
    const pxPerMeterX = gridRect.width / activeFactory.length;
    const pxPerMeterY = gridRect.height / activeFactory.width;

    const mouseXMeters = Math.max(0, Math.min(activeFactory.length, (e.clientX - gridRect.left) / pxPerMeterX));
    const mouseYMeters = Math.max(0, Math.min(activeFactory.width, (e.clientY - gridRect.top) / pxPerMeterY));

    setCursorPos({
      x: Math.round(mouseXMeters * 10) / 10,
      y: Math.round(mouseYMeters * 10) / 10
    });

    if (!draggingMachineId) return;

    let newX = mouseXMeters - dragOffset.x;
    let newY = mouseYMeters - dragOffset.y;

    if (snapToGrid) {
      newX = Math.round(newX * 2) / 2;
      newY = Math.round(newY * 2) / 2;
    }

    const draggingM = machines.find(m => m.id === draggingMachineId);
    const { w, h } = getMachineDimensions(draggingM?.machineType);

    newX = Math.max(0.5, Math.min(activeFactory.length - w - 0.5, newX));
    newY = Math.max(0.5, Math.min(activeFactory.width - h - 0.5, newY));

    updateMachine(draggingMachineId, { x: newX, y: newY });
  };

  const handleGridMouseUp = () => {
    setDraggingMachineId(null);
  };

  // Canvas Panning Handlers
  const handleCanvasMouseDown = (e) => {
    if (activeTool === 'pan' || e.target === gridContainerRef.current || e.target.tagName === 'svg' || e.target.classList.contains('blueprint-grid-canvas')) {
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

  const handleZoom = (direction) => {
    if (direction === 'in') setZoomLevel(prev => Math.min(2.5, prev + 0.15));
    if (direction === 'out') setZoomLevel(prev => Math.max(0.4, prev - 0.15));
    if (direction === 'reset') {
      setZoomLevel(1);
      if (canvasViewportRef.current) {
        canvasViewportRef.current.scrollLeft = 0;
        canvasViewportRef.current.scrollTop = 0;
      }
    }
  };

  const handleResetLayout = () => {
    if (window.confirm('Are you sure you want to clear this factory layout? All placed machines will be deleted.')) {
      machines.forEach(async (m) => {
        await deleteMachine(m.id);
      });
      setSelectedMachineId(null);
    }
  };

  const handleCalculateLayout = async () => {
    if (!activeFactory) return;
    if (flow.length === 0 && machines.length > 0) {
      navigate(`/flow/${activeFactory.id}`);
    } else {
      navigate(`/analysis/${activeFactory.id}`);
    }
  };

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-slate-300 font-mono">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Calculate pixel bounds calibrated to physical meters
  const baseScale = Math.max(16, Math.min(26, 1000 / (activeFactory?.length || 50)));
  const gridWidthPx = Math.max(600, (activeFactory?.length || 50) * baseScale * zoomLevel);
  const gridHeightPx = (gridWidthPx / activeFactory.length) * activeFactory.width;

  const getMachX = (m) => {
    const { w } = getMachineDimensions(m.machineType);
    return Math.max(0.5, Math.min(activeFactory.length - w - 0.5, m.x));
  };
  const getMachY = (m) => {
    const { h } = getMachineDimensions(m.machineType);
    return Math.max(0.5, Math.min(activeFactory.width - h - 0.5, m.y));
  };

  const isDark = canvasTheme === 'dark';

  return (
    <div className={`flex-1 flex flex-col h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      
      {/* Top Application Toolbar */}
      <div className={`h-14 border-b flex items-center justify-between px-4 z-20 shrink-0 shadow-sm gap-2 select-none ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Left: Project title & CAD info */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-mono font-bold">
            <Crosshair className="w-3.5 h-3.5" />
            <span>GRID {activeFactory.length}×{activeFactory.width}m</span>
          </div>

          <button 
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`h-8 px-2.5 rounded text-xs font-mono font-semibold border transition-all flex items-center shrink-0 ${
              snapToGrid 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' 
                : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-300'
            }`}
          >
            SNAP: {snapToGrid ? '0.5m' : 'OFF'}
          </button>

          {/* Industry Preset Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="h-8 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Presets</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {showPresetMenu && (
              <div className={`absolute top-full left-0 mt-2 w-72 rounded-lg shadow-2xl border z-50 p-2 space-y-1 ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-slate-400">
                  Pre-configured Layouts
                </div>
                {PRESET_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleLoadPresetTemplate(tmpl)}
                    className={`w-full text-left p-2 rounded transition-all flex items-start gap-2.5 group ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-xl">{tmpl.icon}</span>
                    <div>
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span className="group-hover:text-cyan-400">{tmpl.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
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

          <LiveTelemetryBadge minimal={true} />
          <button
            onClick={() => navigate(`/telemetry/${activeFactory.id}`)}
            className="h-8 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all border border-slate-700"
            title="Open Live MES Command Center"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">MES FLEET</span>
          </button>
        </div>

        {/* Right Section: View Toggles & Simulation */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={() => setCanvasTheme(isDark ? 'light' : 'dark')}
            className={`h-8 px-2.5 rounded border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              isDark ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle Digital Twin Dark / Clean CAD Blueprint"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            <span className="hidden md:inline">{isDark ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Safety Buffer Zones Toggle */}
          <button
            onClick={() => setShowSafetyZones(!showSafetyZones)}
            className={`h-8 px-2.5 rounded border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              showSafetyZones 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-300'
            }`}
            title="Toggle OSHA Safety Clearance Buffers"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">OSHA BUFFER</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`h-8 px-3 rounded text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isSimulating 
                ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                : isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isSimulating ? 'SIMULATING' : 'PAUSED'}</span>
          </button>

          {/* Speed Selector */}
          <div className={`h-8 flex items-center p-0.5 rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`h-7 px-2 text-[10px] font-mono font-bold rounded transition-all ${
                  simSpeed === s 
                    ? isDark ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'bg-white text-slate-900 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`h-8 px-2.5 rounded border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showHeatmap 
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm' 
                : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">HEATMAP</span>
          </button>
        </div>
      </div>

      {/* Main Designer Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Industrial Component Library */}
        <aside className={`w-64 border-r flex flex-col h-full shrink-0 shadow-sm select-none ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-3.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className="font-bold text-xs uppercase tracking-wider text-cyan-400">Component Library</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Click industrial units to insert onto CAD canvas.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {['Production', 'Logistics & Storage'].map(cat => (
              <div key={cat} className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {cat}
                </span>
                <div className="space-y-1.5">
                  {machineTemplates.filter(t => t.category === cat).map((tmpl) => {
                    const IconComponent = tmpl.icon;
                    return (
                      <button
                        key={tmpl.name}
                        onClick={() => handleAddTemplate(tmpl)}
                        className={`w-full flex items-center justify-between p-2.5 rounded border transition-all text-left text-xs font-semibold ${
                          isDark 
                            ? 'bg-slate-800/80 border-slate-700/80 hover:border-cyan-500/80 hover:bg-slate-800 text-slate-200' 
                            : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded ${isDark ? 'bg-slate-900 text-cyan-400' : 'bg-white text-blue-600 shadow-2xs'}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{tmpl.name}</div>
                            <div className="text-[9px] font-mono text-slate-400">{tmpl.type}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-950/40 px-1.5 py-0.5 rounded">
                          {tmpl.w}×{tmpl.h}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Interactive CAD Blueprint Canvas */}
        <main 
          className="flex-1 flex flex-col overflow-hidden relative"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Scrollable Viewport with Integrated Rulers */}
          <div 
            ref={canvasViewportRef}
            onMouseDown={handleCanvasMouseDown}
            className={`flex-1 overflow-auto p-6 flex select-none min-h-0 min-w-0 ${
              isDark ? 'bg-slate-950' : 'bg-slate-200/60'
            } ${isPanningCanvas || activeTool === 'pan' ? 'cursor-grabbing' : 'cursor-default'}`}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) handleZoom('in');
                else handleZoom('out');
              }
            }}
          >
            {/* Unified Canvas + Rulers Block */}
            <div className="flex flex-col shrink-0 m-auto">
              {/* Top Metric Ruler Row */}
              {showRulers && (
                <div className="flex shrink-0">
                  <div className={`w-6 h-5 shrink-0 border-b border-r ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`} />
                  <TopRuler 
                    length={activeFactory.length} 
                    widthPx={gridWidthPx} 
                    isDark={isDark} 
                    cursorMetersX={cursorPos.x} 
                  />
                </div>
              )}

              {/* Middle Section: Left Ruler + Blueprint Floor Grid */}
              <div className="flex shrink-0">
                {showRulers && (
                  <LeftRuler 
                    width={activeFactory.width} 
                    heightPx={gridHeightPx} 
                    isDark={isDark} 
                    cursorMetersY={cursorPos.y} 
                  />
                )}

                {/* The Physical Factory Floor Grid */}
                <div 
                  ref={gridContainerRef}
                style={{
                  width: `${gridWidthPx}px`,
                  height: `${gridHeightPx}px`,
                  position: 'relative',
                  flexShrink: 0
                }}
                className={`blueprint-grid-canvas border rounded shadow-2xl relative overflow-hidden transition-colors ${
                  isDark 
                    ? 'blueprint-grid-dark border-slate-700/80 shadow-cyan-950/20' 
                    : 'blueprint-grid border-slate-300 shadow-slate-300/40'
                }`}
              >
                {/* Architectural Coordinate Labels */}
                <div className="absolute top-1.5 left-2 text-[9px] font-mono text-slate-500/60 pointer-events-none select-none">
                  (0.0m, 0.0m)
                </div>
                <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-slate-500/60 pointer-events-none select-none">
                  ({activeFactory.length}.0m, {activeFactory.width}.0m)
                </div>

                {/* Industrial SVG Vectors & Flow System */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
                      <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat-medium" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat-low" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Heatmap Halos */}
                  {showHeatmap && machines.map((m) => {
                    const { w, h } = getMachineDimensions(m.machineType);
                    const cxPct = ((getMachX(m) + w / 2) / activeFactory.length) * 100;
                    const cyPct = ((getMachY(m) + h / 2) / activeFactory.width) * 100;
                    const heatRadiusPct = (8 / activeFactory.length) * 100;

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

                  {/* Orthogonal Production Flow Tracks & Particle Telemetry */}
                  {flow.length >= 2 && flow.map((step, idx) => {
                    if (idx === flow.length - 1) return null;
                    const nextStep = flow[idx + 1];
                    
                    const machA = machines.find(m => m.id === step.machineId);
                    const machB = machines.find(m => m.id === nextStep.machineId);

                    if (machA && machB) {
                      const dimA = getMachineDimensions(machA.machineType);
                      const dimB = getMachineDimensions(machB.machineType);

                      const px1 = ((getMachX(machA) + dimA.w / 2) / activeFactory.length) * 100;
                      const py1 = ((getMachY(machA) + dimA.h / 2) / activeFactory.width) * 100;
                      const px2 = ((getMachX(machB) + dimB.w / 2) / activeFactory.length) * 100;
                      const py2 = ((getMachY(machB) + dimB.h / 2) / activeFactory.width) * 100;

                      const dist = Math.abs(machB.x - machA.x) + Math.abs(machB.y - machA.y);
                      const isLongTravel = dist > 15;
                      const trackColor = isLongTravel 
                        ? '#F59E0B' 
                        : isDark ? '#38BDF8' : '#2563EB';

                      // Generate orthogonal Manhattan conveyor route with rounded elbows
                      const pathD = getOrthogonalPath(px1, py1, px2, py2, 2.5);
                      const baseDuration = Math.max(1, 4.5 / (simSpeed * (machA.throughput / 100)));

                      return (
                        <g key={`${step.id}-${idx}`}>
                          {/* Heatmap overlay glow */}
                          {showHeatmap && isLongTravel && (
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#EF4444"
                              strokeWidth="8"
                              strokeOpacity="0.3"
                              strokeLinecap="round"
                            />
                          )}

                          {/* Dual-Rail Underlay Conveyor Track */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={isDark ? '#0F172A' : '#E2E8F0'}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Outer Conveyor Glow */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={trackColor}
                            strokeWidth="3"
                            strokeOpacity="0.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Animated Directional Laser Dash */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={trackColor}
                            strokeWidth="2"
                            strokeDasharray="6,4"
                            className={isSimulating ? "animate-flow-dash" : ""}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Docking Terminals */}
                          <circle cx={`${px1}%`} cy={`${py1}%`} r="3.5" fill={trackColor} />
                          <circle cx={`${px2}%`} cy={`${py2}%`} r="3.5" fill={trackColor} />

                          {/* Midpoint Distance Callout */}
                          <g transform={`translate(${(px1 + px2) / 2}, ${(py1 + py2) / 2})`}>
                            <rect
                              x="-20"
                              y="-8"
                              width="40"
                              height="16"
                              rx="3"
                              fill={isDark ? '#0F172A' : '#1E293B'}
                              stroke={trackColor}
                              strokeWidth="0.8"
                            />
                            <text
                              x="0"
                              y="3"
                              fill="#F8FAFC"
                              fontSize="8"
                              fontWeight="bold"
                              textAnchor="middle"
                              fontFamily="monospace"
                            >
                              {dist.toFixed(1)}m
                            </text>
                          </g>

                          {/* High-Tech Glowing Energy Packet (Replaces 📦) */}
                          {isSimulating && machA.status === 'Running' && (
                            <g filter="url(#laserGlow)">
                              <circle r="4" fill={isDark ? '#38BDF8' : '#2563EB'}>
                                <animateMotion
                                  path={pathD}
                                  dur={`${baseDuration}s`}
                                  repeatCount="indefinite"
                                />
                              </circle>
                              <circle r="2" fill="#FFFFFF">
                                <animateMotion
                                  path={pathD}
                                  dur={`${baseDuration}s`}
                                  repeatCount="indefinite"
                                />
                              </circle>
                              <circle r="2" fill={isDark ? '#818CF8' : '#60A5FA'} opacity="0.6">
                                <animateMotion
                                  path={pathD}
                                  dur={`${baseDuration}s`}
                                  begin="-0.12s"
                                  repeatCount="indefinite"
                                />
                              </circle>
                            </g>
                          )}
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>

                {/* Render Placed Machine Nodes */}
                {machines.map((mach) => {
                  const isSelected = mach.id === selectedMachineId;
                  const isDragging = mach.id === draggingMachineId;
                  const { w, h } = getMachineDimensions(mach.machineType);

                  const posX = getMachX(mach);
                  const posY = getMachY(mach);

                  const tel = telemetryByMachine[mach.id];
                  const isAlarm = tel?.status === 'Alarm' || tel?.alert !== null;
                  const isOverheating = tel && tel.temp > 75;

                  const machinePositionStyle = {
                    left: `${(posX / activeFactory.length) * 100}%`,
                    top: `${(posY / activeFactory.width) * 100}%`,
                    width: `${(w / activeFactory.length) * 100}%`,
                    height: `${(h / activeFactory.width) * 100}%`,
                    transform: `rotate(${mach.orientation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.15s, left 0.08s, top 0.08s'
                  };

                  return (
                    <div
                      key={mach.id}
                      onMouseDown={(e) => handleGridMouseDown(e, mach)}
                      onDoubleClick={() => setInspectingMachine(mach)}
                      style={machinePositionStyle}
                      className={`absolute rounded flex flex-col justify-between cursor-move select-none z-20 transition-all ${
                        isDark 
                          ? 'bg-slate-900/95 border border-slate-700/80 shadow-lg text-slate-200' 
                          : 'bg-white border border-slate-300 shadow-md text-slate-800'
                      } ${
                        isAlarm 
                          ? 'ring-2 ring-rose-500 animate-pulse' 
                          : isSelected 
                            ? isDark ? 'ring-2 ring-cyan-400 border-cyan-400' : 'ring-2 ring-blue-500 border-blue-500' 
                            : isDark ? 'hover:border-slate-500' : 'hover:border-slate-400'
                      }`}
                    >
                      {/* OSHA Safety Clearance Buffer Halo */}
                      {showSafetyZones && (
                        <div 
                          className="absolute -inset-2.5 rounded border border-amber-500/40 safety-hatch-pattern pointer-events-none transition-opacity z-[-1]"
                          style={{ opacity: isSelected ? 1 : 0.5 }}
                        />
                      )}

                      {/* CAD Selection Anchors */}
                      {isSelected && (
                        <div className="absolute -inset-1 border border-cyan-400/80 pointer-events-none">
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-cyan-600" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-cyan-600" />
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-cyan-600" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-cyan-600" />
                          {/* Rotation indicator pointer */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 border border-white" />
                        </div>
                      )}

                      {/* Machine Header: ID & Status LED */}
                      <div className={`h-4.5 px-1.5 flex items-center justify-between border-b shrink-0 text-[8px] font-mono font-bold ${
                        isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
                      }`}>
                        <span className="truncate max-w-[70%]">
                          {mach.machineName.split(' ')[0].substring(0, 4)}-{mach.machineName.split(' ')[1] || '01'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isAlarm 
                              ? 'bg-rose-500 animate-ping' 
                              : mach.status === 'Running' 
                                ? 'bg-emerald-400 animate-pulse' 
                                : 'bg-slate-500'
                          }`} />
                        </div>
                      </div>

                      {/* Machine Body: Precision CAD Schematic Vector */}
                      <div className="flex-1 flex items-center justify-center p-1 overflow-hidden">
                        <MachineSchematic 
                          type={mach.machineType} 
                          status={mach.status} 
                          isSelected={isSelected} 
                          isDark={isDark} 
                        />
                      </div>

                      {/* Machine Footer: Telemetry & Node Label */}
                      <div className={`h-4 px-1 flex items-center justify-between border-t shrink-0 text-[7px] font-mono ${
                        isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
                      }`}>
                        <span className="font-bold">M{machines.indexOf(mach) + 1}</span>
                        {tel && (
                          <span className={`font-bold ${isOverheating ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`}>
                            {tel.temp}°C
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </div>

          {/* Floating CAD HUD at Bottom of Viewport */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-2xl backdrop-blur-md select-none font-mono text-xs transition-all pointer-events-auto bg-slate-900/90 border-slate-700/80 text-slate-200">
            {/* Tool Selection */}
            <button
              onClick={() => setActiveTool(activeTool === 'select' ? 'pan' : 'select')}
              className={`p-1.5 rounded transition-all flex items-center gap-1 ${
                activeTool === 'pan' ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
              title="Pan Tool (Hand)"
            >
              <Move className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{activeTool === 'pan' ? 'PAN' : 'SELECT'}</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Zoom Controls */}
            <button 
              onClick={() => handleZoom('out')} 
              className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-cyan-400 px-1 min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={() => handleZoom('in')} 
              className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => handleZoom('reset')} 
              className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-300"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Rulers & Minimap Toggles */}
            <button
              onClick={() => setShowRulers(!showRulers)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                showRulers ? 'bg-slate-800 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              RULERS
            </button>
            <button
              onClick={() => setShowMinimap(!showMinimap)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                showMinimap ? 'bg-slate-800 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              MAP
            </button>

            {/* Cursor Coordinate Display */}
            {cursorPos.x !== null && (
              <>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <span className="text-[10px] text-slate-400 px-1">
                  X: <b className="text-white">{cursorPos.x}m</b> Y: <b className="text-white">{cursorPos.y}m</b>
                </span>
              </>
            )}
          </div>

          {/* Floating Minimap in Bottom-Right */}
          {showMinimap && (
            <div className="absolute bottom-5 right-5 z-30 pointer-events-auto">
              <FactoryMinimap 
                factory={activeFactory} 
                machines={machines} 
                flow={flow} 
                viewportRef={canvasViewportRef}
                gridWidthPx={gridWidthPx}
                isDark={isDark}
              />
            </div>
          )}
        </main>

        {/* Right Side: Machine Property Inspector */}
        <aside className={`w-80 border-l flex flex-col h-full shrink-0 shadow-sm select-none ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`p-3.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className="font-bold text-xs uppercase tracking-wider text-cyan-400">Node Inspector</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Parameters & real-time telemetry.</p>
          </div>

          {selectedMachine ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Identity */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identity</span>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedMachine.machineName}
                    onChange={(e) => updateMachine(selectedMachine.id, { machineName: e.target.value })}
                    className={`w-full border rounded px-2.5 py-1.5 text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">Type</label>
                  <select
                    value={selectedMachine.machineType}
                    onChange={(e) => updateMachine(selectedMachine.id, { machineType: e.target.value })}
                    className={`w-full border rounded px-2.5 py-1.5 text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500'
                    }`}
                  >
                    <option value="Input">Input (Raw Material Dock)</option>
                    <option value="Processing">Processing (CNC Mill / Machining)</option>
                    <option value="Assembly">Assembly (Robotic / Manual Cell)</option>
                    <option value="Quality">Quality (CMM Optical Inspection)</option>
                    <option value="Logistics">Logistics (Packaging & Shipping)</option>
                    <option value="Storage">Storage (High-Bay Warehouse Racking)</option>
                  </select>
                </div>
              </div>

              {/* Spatial Coordinates */}
              <div className={`space-y-3 border-t pt-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Position & Angle</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">Position X</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedMachine.x}
                        onChange={(e) => updateMachine(selectedMachine.id, { x: parseFloat(e.target.value) || 0 })}
                        className={`w-full border rounded pl-2.5 pr-6 py-1.5 text-xs font-mono font-semibold outline-none ${
                          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                        }`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">m</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">Position Y</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedMachine.y}
                        onChange={(e) => updateMachine(selectedMachine.id, { y: parseFloat(e.target.value) || 0 })}
                        className={`w-full border rounded pl-2.5 pr-6 py-1.5 text-xs font-mono font-semibold outline-none ${
                          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                        }`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">m</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] text-slate-400 font-bold">Orientation</label>
                    <span className="text-[10px] font-mono font-bold text-cyan-400">{selectedMachine.orientation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="270"
                    step="90"
                    value={selectedMachine.orientation}
                    onChange={(e) => updateMachine(selectedMachine.id, { orientation: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1 px-1">
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                    <span>270°</span>
                  </div>
                </div>
              </div>

              {/* Operational & Health */}
              <div className={`space-y-3 border-t pt-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Status</span>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">State</label>
                  <select
                    value={selectedMachine.status}
                    onChange={(e) => updateMachine(selectedMachine.id, { status: e.target.value })}
                    className={`w-full border rounded px-2.5 py-1.5 text-xs font-semibold outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-cyan-400' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="Running">🟢 Running (Conveyor Active)</option>
                    <option value="Idle">⚪ Standby / Idle</option>
                    <option value="Maintenance">🔴 Maintenance Required</option>
                  </select>
                </div>
              </div>

              {/* Real-time Edge Telemetry Card */}
              {selectedMachine && (
                <div className={`space-y-3 border-t pt-4 rounded-lg p-3 text-slate-100 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      Live Edge Telemetry
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400">ONLINE</span>
                  </div>

                  {(() => {
                    const selTel = telemetryByMachine[selectedMachine.id] || {
                      temp: 45,
                      vibration: 1.2,
                      rpm: 1200,
                      powerKw: 12.0
                    };
                    return (
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-[8px] text-slate-400 uppercase block">Temp</span>
                          <span className={`font-bold ${selTel.temp > 75 ? 'text-rose-400' : 'text-white'}`}>
                            {selTel.temp}°C
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-[8px] text-slate-400 uppercase block">Vibration</span>
                          <span className={`font-bold ${selTel.vibration > 4.5 ? 'text-amber-400' : 'text-white'}`}>
                            {selTel.vibration} mm/s
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-[8px] text-slate-400 uppercase block">Spindle</span>
                          <span className="font-bold text-white">{selTel.rpm} RPM</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-[8px] text-slate-400 uppercase block">Power</span>
                          <span className="font-bold text-amber-300">{selTel.powerKw} kW</span>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => setInspectingMachine(selectedMachine)}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Inspect Live Waveforms</span>
                  </button>
                </div>
              )}

              {/* Delete Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 rounded text-xs font-bold transition-all border border-rose-800/80"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Node
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <Compass className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">No node selected</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">
                Click on any placed machine in the grid to inspect and adjust parameters.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom Action Footer Bar */}
      <footer className={`h-14 border-t flex items-center justify-between px-6 z-10 shrink-0 select-none ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Layout: <span className="text-white">{activeFactory.name}</span></span>
          <span className="text-slate-700 mx-2">|</span>
          <span className="font-mono text-[11px]">Nodes placed: {machines.length}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleResetLayout}
            className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
              isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Reset
          </button>
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={handleCalculateLayout}
            disabled={machines.length === 0}
            className="px-5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded transition-all text-xs font-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Flow & Efficiency
          </button>
        </div>
      </footer>

      {/* Slide-over Machine Telemetry Drawer */}
      {inspectingMachine && (
        <MachineTelemetryDrawer 
          machine={inspectingMachine} 
          onClose={() => setInspectingMachine(null)} 
        />
      )}
    </div>
  );
}
