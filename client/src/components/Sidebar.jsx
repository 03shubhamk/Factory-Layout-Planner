import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  LayoutDashboard, 
  Plus, 
  DraftingCompass, 
  GitBranch, 
  BarChart3, 
  Sparkles, 
  FileText, 
  Activity, 
  Cpu,
  ChevronRight,
  Factory
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeFactory } = useFactory();

  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        { name: 'Facilities Dashboard', path: '/', icon: LayoutDashboard, requiresFactory: false },
        { name: 'New Plant Project', path: '/create', icon: Plus, requiresFactory: false },
      ]
    },
    {
      group: 'CAD & ROUTING',
      items: [
        { name: 'CAD Layout Studio', path: activeFactory ? `/designer/${activeFactory.id}` : '#', icon: DraftingCompass, requiresFactory: true },
        { name: 'Production Flow Routing', path: activeFactory ? `/flow/${activeFactory.id}` : '#', icon: GitBranch, requiresFactory: true },
      ]
    },
    {
      group: 'ENGINEERING AUDIT',
      items: [
        { name: 'Operations Research', path: activeFactory ? `/analysis/${activeFactory.id}` : '#', icon: BarChart3, requiresFactory: true },
        { name: 'Layout Optimization', path: activeFactory ? `/suggestions/${activeFactory.id}` : '#', icon: Sparkles, requiresFactory: true },
        { name: 'Engineering Report', path: activeFactory ? `/report/${activeFactory.id}` : '#', icon: FileText, requiresFactory: true },
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { name: 'SCADA & Telemetry', path: activeFactory ? `/telemetry/${activeFactory.id}` : '#', icon: Activity, requiresFactory: true },
      ]
    }
  ];

  const handleNav = (item) => {
    if (item.requiresFactory && !activeFactory) {
      return;
    }
    navigate(item.path);
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
            <Factory className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>PLANTCAD</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-900/60 text-blue-300 font-mono font-semibold border border-blue-700/50">PRO</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400">FACILITY LAYOUT SUITE</div>
          </div>
        </div>
      </div>

      {/* Active Factory Context Indicator */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Active Project</span>
          {activeFactory && (
            <span className="text-emerald-400 font-mono text-[8px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LOADED
            </span>
          )}
        </div>
        {activeFactory ? (
          <div className="p-2 rounded-md bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-bold text-slate-100 truncate" title={activeFactory.name}>
              {activeFactory.name}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
              <span>{activeFactory.length}m × {activeFactory.width}m</span>
              <span className="text-slate-400">{activeFactory.departmentCount || 4} Depts</span>
            </div>
          </div>
        ) : (
          <div className="p-2 rounded-md bg-slate-900/40 border border-dashed border-slate-800 text-[10px] text-slate-400 text-center">
            No active plant selected
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-2 text-[9px] font-mono font-bold text-slate-400 tracking-wider">
              {group.group}
            </div>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path.split('/:')[0]));
              
              const isDisabled = item.requiresFactory && !activeFactory;
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNav(item)}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold' 
                      : isDisabled
                        ? 'text-slate-400 cursor-not-allowed opacity-40'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ENGINE v2.4</span>
        </div>
        <span className="text-slate-400">STANDALONE</span>
      </div>
    </aside>
  );
}
