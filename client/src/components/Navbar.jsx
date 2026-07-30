import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { Bell, HelpCircle, Search, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeFactory } = useFactory();

  // Determine active project page layout tab
  const getActiveTab = () => {
    if (location.pathname.startsWith('/designer')) return 'designer';
    if (location.pathname.startsWith('/analysis')) return 'analysis';
    if (location.pathname.startsWith('/suggestions')) return 'suggestions';
    if (location.pathname.startsWith('/report')) return 'report';
    return null;
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab) => {
    if (!activeFactory) return;
    if (tab === 'designer') navigate(`/designer/${activeFactory.id}`);
    if (tab === 'analysis') navigate(`/analysis/${activeFactory.id}`);
    if (tab === 'suggestions') navigate(`/suggestions/${activeFactory.id}`);
    if (tab === 'report') navigate(`/report/${activeFactory.id}`);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0 shadow-sm">
      {/* Title / Brand */}
      <div className="flex items-center gap-8">
        <span className="font-bold text-slate-800 text-lg tracking-tight hover:cursor-pointer" onClick={() => navigate('/')}>
          Factory Layout Planner
        </span>

        {/* Dynamic Context Tabs */}
        {activeFactory && activeTab && (
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => handleTabChange('designer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'designer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Designer
            </button>
            <button
              onClick={() => navigate(`/flow/${activeFactory.id}`)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                location.pathname.startsWith('/flow')
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flow
            </button>
            <button
              onClick={() => handleTabChange('analysis')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'analysis'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => handleTabChange('suggestions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'suggestions'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Suggestions
            </button>
            <button
              onClick={() => handleTabChange('report')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'report'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Report
            </button>
          </nav>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative w-64 max-md:hidden">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search layouts..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:border-primary focus:bg-white transition-all text-slate-700"
          />
        </div>

        {/* Current Factory Badge */}
        {activeFactory && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>{activeFactory.name}</span>
          </div>
        )}

        {/* Utility Icons */}
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-800 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
          </button>
          <button className="hover:text-slate-800 transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
            <User className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
