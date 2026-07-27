import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Grid, 
  GitCommit, 
  BarChart2, 
  Lightbulb, 
  FileText, 
  Settings, 
  Wrench, 
  HelpCircle,
  Plus
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeFactory } = useFactory();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, requiresFactory: false },
    { name: 'Create Factory', path: '/create', icon: PlusCircle, requiresFactory: false },
    { name: 'Layout Designer', path: activeFactory ? `/designer/${activeFactory.id}` : '#', icon: Grid, requiresFactory: true },
    { name: 'Production Flow', path: activeFactory ? `/flow/${activeFactory.id}` : '#', icon: GitCommit, requiresFactory: true },
    { name: 'Analysis', path: activeFactory ? `/analysis/${activeFactory.id}` : '#', icon: BarChart2, requiresFactory: true },
    { name: 'Suggestions', path: activeFactory ? `/suggestions/${activeFactory.id}` : '#', icon: Lightbulb, requiresFactory: true },
    { name: 'Reports', path: activeFactory ? `/report/${activeFactory.id}` : '#', icon: FileText, requiresFactory: true },
  ];

  const handleNav = (item) => {
    if (item.requiresFactory && !activeFactory) {
      return;
    }
    navigate(item.path);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight">Planner Pro</h1>
            <p className="text-xs text-slate-500 font-mono">
              {activeFactory ? `Active: ${activeFactory.name}` : 'Industrial Node A'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path.split('/:')[0]));
          
          const isDisabled = item.requiresFactory && !activeFactory;
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => handleNav(item)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary text-white' 
                  : isDisabled
                    ? 'text-slate-600 cursor-not-allowed opacity-50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}

        {/* Quick New Layout Action */}
        <div className="pt-6">
          <button
            onClick={() => navigate('/create')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all font-semibold shadow-soft text-sm border border-slate-200"
          >
            <Plus className="w-4 h-4" />
            New Layout
          </button>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all">
          <Wrench className="w-4 h-4" />
          <span>Maintenance</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all">
          <HelpCircle className="w-4 h-4" />
          <span>Help Center</span>
        </button>
      </div>
    </aside>
  );
}
