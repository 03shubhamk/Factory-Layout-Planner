import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  DraftingCompass, 
  GitBranch, 
  BarChart3, 
  Sparkles, 
  FileText, 
  Activity, 
  Plus, 
  ChevronRight,
  HardHat
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeFactory } = useFactory();

  const getActiveTab = () => {
    if (location.pathname.startsWith('/designer')) return 'designer';
    if (location.pathname.startsWith('/flow')) return 'flow';
    if (location.pathname.startsWith('/analysis')) return 'analysis';
    if (location.pathname.startsWith('/suggestions')) return 'suggestions';
    if (location.pathname.startsWith('/report')) return 'report';
    if (location.pathname.startsWith('/telemetry')) return 'telemetry';
    return null;
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab) => {
    if (!activeFactory) return;
    if (tab === 'designer') navigate(`/designer/${activeFactory.id}`);
    if (tab === 'flow') navigate(`/flow/${activeFactory.id}`);
    if (tab === 'analysis') navigate(`/analysis/${activeFactory.id}`);
    if (tab === 'suggestions') navigate(`/suggestions/${activeFactory.id}`);
    if (tab === 'report') navigate(`/report/${activeFactory.id}`);
    if (tab === 'telemetry') navigate(`/telemetry/${activeFactory.id}`);
  };

  const tabs = [
    { key: 'designer', label: 'CAD Studio', icon: DraftingCompass },
    { key: 'flow', label: 'Material Flow', icon: GitBranch },
    { key: 'analysis', label: 'OR Analysis', icon: BarChart3 },
    { key: 'suggestions', label: 'Optimization', icon: Sparkles },
    { key: 'report', label: 'PDF Report', icon: FileText },
    { key: 'telemetry', label: 'SCADA Fleet', icon: Activity },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0 select-none">
      {/* Left: Breadcrumbs & Factory Context */}
      <div className="flex items-center gap-2 text-xs">
        <button 
          onClick={() => navigate('/')}
          className="font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Facilities
        </button>
        {activeFactory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-800 truncate max-w-[180px]">
              {activeFactory.name}
            </span>
          </>
        )}
      </div>

      {/* Center: Engineering Workspace Mode Switcher */}
      {activeFactory && (
        <nav className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Right: Quick Actions & Operator Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Plant</span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-600">
          <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <HardHat className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-700 hidden lg:inline">
            FACILITY LEAD
          </span>
        </div>
      </div>
    </header>
  );
}
