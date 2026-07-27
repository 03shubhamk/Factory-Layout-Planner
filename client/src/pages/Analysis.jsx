import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  HelpCircle,
  FileDown,
  ChevronRight,
  TrendingUp,
  Map,
  Settings,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeFactory, machines, flow, metrics, loadFactoryDetails, saveReport } = useFactory();

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id]);

  // Map material flow steps with distance
  const flowBreakdown = useMemo(() => {
    if (!flow || flow.length < 2 || machines.length === 0) return [];
    
    const breakdown = [];
    for (let i = 0; i < flow.length - 1; i++) {
      const stepA = flow[i];
      const stepB = flow[i + 1];
      const mA = machines.find(m => m.id === stepA.machineId);
      const mB = machines.find(m => m.id === stepB.machineId);
      
      if (mA && mB) {
        // Manhattan distance
        const dist = Math.abs(mB.x - mA.x) + Math.abs(mB.y - mA.y);
        breakdown.push({
          name: `${mA.machineName.split(' ')[0]} → ${mB.machineName.split(' ')[0]}`,
          label: `${mA.machineName} to ${mB.machineName}`,
          distance: dist,
          cost: parseFloat((dist * 0.05).toFixed(2)) // hypothetical $0.05 per meter travel cost
        });
      }
    }
    return breakdown;
  }, [flow, machines]);

  // Archive current analysis report into SQLite
  const handleSaveReport = async () => {
    if (!activeFactory) return;
    
    const reportData = {
      distance: metrics.totalDistance,
      efficiency: metrics.efficiency,
      rating: metrics.rating,
      suggestions: JSON.stringify([
        {
          title: 'Relocate Processing Line',
          description: 'Flow bottleneck detected at assembly queue.',
          estimatedSaving: 4
        }
      ])
    };
    
    await saveReport(reportData);
    navigate(`/report/${activeFactory.id}`);
  };

  // CSV download trigger
  const handleExportCSV = () => {
    if (!activeFactory || machines.length === 0) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Asset ID,Machine Name,Machine Type,Position X (m),Position Y (m),Status,Health,Load (%)\n';
    
    machines.forEach((m, idx) => {
      csvContent += `M${idx + 1},"${m.machineName}","${m.machineType}",${m.x},${m.y},"${m.status}","${m.health}",${m.load}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeFactory.name.replace(/\s+/g, '_')}_asset_configuration.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get star ratings based on efficiency
  const getRatingStars = (rating) => {
    switch (rating) {
      case 'Excellent': return 5;
      case 'Good': return 4;
      case 'Average': return 3;
      default: return 2;
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 space-y-8">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>
              {activeFactory.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">Analysis</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Factory Analysis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overall efficiency audit and routing breakdown of placed industrial assets.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Efficiency Radial Score */}
        <div className="bg-white p-6 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Efficiency Score</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{metrics.efficiency}%</span>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 block">RATING TIER</span>
          </div>
          
          {/* Radial circular progress indicator */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#E2E8F0"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#2563EB"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={176}
                strokeDashoffset={176 - (176 * metrics.efficiency) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[9px] font-extrabold text-primary uppercase font-mono">
              {metrics.efficiency >= 90 ? 'MAX' : 'OK'}
            </span>
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white p-6 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Distance</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{metrics.totalDistance}m</span>
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Per production cycle</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg text-primary flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Layout Rating */}
        <div className="bg-white p-6 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Layout Rating</span>
            <div className="flex gap-0.5 mt-2.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <span 
                  key={idx} 
                  className={`text-lg leading-none ${
                    idx < getRatingStars(metrics.rating) ? 'text-amber-400' : 'text-slate-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold text-success mt-2 block font-mono">{metrics.rating.toUpperCase()} GRADE</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg text-success flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Active Machines */}
        <div className="bg-white p-6 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Machines</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{metrics.machineCount} Units</span>
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
              {machines.filter(m => m.health === 'Optimal').length} / {machines.length} operational
            </span>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-lg text-slate-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Analysis grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns (Breakdowns & Tables) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Material Flow breakdown charts */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="font-bold text-slate-900 text-base">Material Flow Breakdown</h2>
              <span className="text-xs text-slate-400 font-mono">Distance metrics</span>
            </div>

            {flowBreakdown.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Define at least two stages in the flow view to calculate step-by-step distances.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Horizontal Progress Bars */}
                <div className="space-y-4">
                  {flowBreakdown.map((item, idx) => {
                    const maxDist = Math.max(...flowBreakdown.map(x => x.distance), 1);
                    const percentWidth = (item.distance / maxDist) * 100;
                    
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{item.label}</span>
                          <span className="font-mono text-primary">{item.distance}m</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${percentWidth}%` }}
                            className={`h-full rounded-full transition-all ${
                              item.distance > 15 ? 'bg-primary' : 'bg-primary-light'
                            }`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recharts Graphical chart overlay */}
                <div className="h-64 border-t border-slate-100 pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={flowBreakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B', fontWeight: 600 }} />
                      <YAxis tick={{ fontSize: 9, fill: '#64748B' }} unit="m" />
                      <Tooltip 
                        contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} 
                        itemStyle={{ color: '#60A5FA' }}
                      />
                      <Bar dataKey="distance" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Efficiency Table */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-4 mb-4">
              Efficiency Analysis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100 pb-2">
                    <th className="py-3">Production Step</th>
                    <th className="py-3">Material Flow</th>
                    <th className="py-3 text-center">Handling Cost</th>
                    <th className="py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {flowBreakdown.map((item, idx) => {
                    let ratingTag = 'EXCELLENT';
                    let tagStyle = 'bg-emerald-50 text-success border-emerald-100';

                    if (item.distance > 25) {
                      ratingTag = 'WARNING';
                      tagStyle = 'bg-rose-50 text-danger border-rose-100';
                    } else if (item.distance > 12) {
                      ratingTag = 'GOOD';
                      tagStyle = 'bg-blue-50 text-primary border-blue-100';
                    }

                    return (
                      <tr key={idx}>
                        <td className="py-4">Stage {idx + 1}</td>
                        <td className="py-4 font-semibold text-slate-900">{item.label}</td>
                        <td className="py-4 text-center font-mono font-bold text-slate-600">
                          ${item.cost.toFixed(2)} / unit
                        </td>
                        <td className="py-4 text-right">
                          <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold ${tagStyle}`}>
                            {ratingTag}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {flowBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        No processing flow data. Map production steps to see cost estimates.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Columns (Optimization Center / Recommendations) */}
        <div className="space-y-6">
          {/* AI/Heuristic Optimization Panel */}
          <div className="bg-slate-900 text-white rounded-custom p-6 space-y-4 shadow-premium relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <h2 className="text-xs font-bold text-primary-light uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              AI Optimization
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our layout analysis engine has scanned machine coordinate alignments and found potential bottleneck reductions.
            </p>
            <button
              onClick={() => navigate(`/suggestions/${activeFactory.id}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs transition-all shadow-md mt-2"
            >
              View Suggestions
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Report center actions */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Report Center</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleSaveReport}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all font-semibold text-xs text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-primary" />
                  <span>Export PDF Report</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all font-semibold text-xs text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-success" />
                  <span>Export CSV Data</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Return button */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6 text-center space-y-2">
            <button
              onClick={() => navigate(`/designer/${activeFactory.id}`)}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-all"
            >
              Back to Designer
            </button>
            <span className="text-[10px] text-slate-400 block font-mono">
              Auto-saved just now
            </span>
          </div>

          {/* Miniature floor visualizer placeholder */}
          <div className="border border-slate-200 rounded-custom overflow-hidden shadow-soft relative bg-slate-100 h-40 flex items-center justify-center">
            <div className="absolute inset-0 blueprint-grid opacity-30"></div>
            <div className="z-10 bg-slate-900/90 text-white font-mono text-[9px] px-3 py-1.5 rounded font-bold uppercase border border-slate-800 tracking-wider">
              LOCKED VIEW
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
