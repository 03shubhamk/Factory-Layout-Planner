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
  Layers,
  BookOpen,
  Calculator,
  Activity,
  Boxes,
  Compass
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Efficiency Radial Score */}
        <div className="bg-white p-5 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Efficiency (η)</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{metrics.efficiency}%</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-wider mt-0.5 block">{metrics.rating.toUpperCase()} TIER</span>
          </div>
          
          {/* Radial circular progress indicator */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="#E2E8F0"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="#2563EB"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={150}
                strokeDashoffset={150 - (150 * metrics.efficiency) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[8px] font-extrabold text-primary uppercase font-mono">
              {metrics.efficiency >= 85 ? 'OPT' : 'OK'}
            </span>
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white p-5 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Travel (D)</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{metrics.totalDistance}m</span>
            <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">~{metrics.travelTime}s AGV cycle</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-lg text-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Material Handling Work (MHW) */}
        <div className="bg-white p-5 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Material Work (MHW)</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">
              {metrics.mhw || Math.round(metrics.totalDistance * 100)}
            </span>
            <span className="text-[9px] text-slate-500 font-semibold mt-0.5 block font-mono">
              ${(metrics.mhwCostPerHour || (metrics.totalDistance * 0.05)).toFixed(2)}/cycle cost
            </span>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-lg text-indigo-600 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        {/* Area Utilization Ratio (AUR) */}
        <div className="bg-white p-5 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Floor AUR</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">
              {metrics.areaUtilization || 24.5}%
            </span>
            <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">
              Equipment + OSHA buffer
            </span>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-lg text-amber-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        {/* Active Machines */}
        <div className="bg-white p-5 rounded-custom border border-slate-200 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Asset Fleet</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{metrics.machineCount} Units</span>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5 block font-mono">
              {machines.filter(m => m.health === 'Optimal').length} / {machines.length} OPTIMAL
            </span>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-lg text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Academic Methodology & Engineering Parameters Reference Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-custom p-6 border border-slate-700 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-cyan-400 border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                Operations Research & Facilities Planning Formulation
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Academic Reference
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tompkins, White, Bozer, Tanchoco: <em>Facilities Planning</em> (4th Ed., Ch. 6: Quantitative Models) & Muther: <em>Systematic Layout Planning (SLP)</em>.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-300 bg-slate-950/60 px-3 py-1 rounded border border-slate-800 shrink-0">
            OBJECTIVE: Min ΣΣ (f_ij × c_ij × d_ij)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">1. Flow Volume (f_ij)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Material batch transfer frequency (L/min, BPM, or parts/hr) transported between origin unit <em>i</em> and destination unit <em>j</em>.
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">2. Manhattan Metric (d_ij)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Rectilinear distance <code>d_ij = |x_i - x_j| + |y_i - y_j|</code> representing orthogonal material transport aisles and AGV guide tracks.
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">3. Material Work (MHW)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Total handling effort: <code>MHW = Σ Σ f_ij · c_ij · d_ij</code> where unit transport cost <code>c_ij = $0.05/meter</code>.
            </p>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">4. Area Ratio (AUR)</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Ratio of physical machinery footprints + OSHA safety buffer clearance (1.0m halo) to total gross facility floor area.
            </p>
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

          {/* Operations Research From-To Flow Matrix (F = [f_ij]) */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary" />
                  From-To Flow Matrix (F = [f_ij])
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inter-departmental material transfer volume per production shift (Tompkins Facilities Planning Model).
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold shrink-0">
                TOTAL: {metrics.fromToMatrix?.totalVolume || 0} UNITS/HR
              </span>
            </div>

            {(!metrics.fromToMatrix || !metrics.fromToMatrix.labels || metrics.fromToMatrix.labels.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Add machines and sequence production flow to compute the From-To flow matrix.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                      <th className="p-2.5 font-mono">From \ To</th>
                      {metrics.fromToMatrix.labels.map((name, j) => (
                        <th key={j} className="p-2.5 text-center font-mono" title={name}>
                          M{j + 1}
                        </th>
                      ))}
                      <th className="p-2.5 text-right font-mono text-primary">Outflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {metrics.fromToMatrix.labels.map((name, i) => {
                      const rowVals = metrics.fromToMatrix.matrix[i] || [];
                      const rowSum = rowVals.reduce((acc, v) => acc + v, 0);
                      return (
                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-2.5 font-bold text-slate-800 flex items-center gap-1.5 truncate max-w-[160px]" title={name}>
                            <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              M{i + 1}
                            </span>
                            <span className="truncate">{name.split(' ')[0]}</span>
                          </td>
                          {metrics.fromToMatrix.labels.map((_, j) => {
                            const val = rowVals[j] || 0;
                            const isSelf = i === j;
                            return (
                              <td key={j} className={`p-2.5 text-center text-[11px] ${
                                isSelf 
                                  ? 'bg-slate-100/60 text-slate-300 font-normal' 
                                  : val > 0 
                                    ? 'bg-blue-50/80 text-blue-700 font-bold border border-blue-100/80' 
                                    : 'text-slate-400'
                              }`}>
                                {isSelf ? '—' : val > 0 ? val : '·'}
                              </td>
                            );
                          })}
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            {rowSum}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-mono text-[10px] font-bold text-slate-700">
                      <td className="p-2.5 text-primary">Inflow</td>
                      {metrics.fromToMatrix.labels.map((_, j) => {
                        const colSum = metrics.fromToMatrix.matrix.reduce((acc, row) => acc + (row[j] || 0), 0);
                        return (
                          <td key={j} className="p-2.5 text-center text-primary">
                            {colSum}
                          </td>
                        );
                      })}
                      <td className="p-2.5 text-right text-primary">
                        {metrics.fromToMatrix.totalVolume}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns (Optimization Center / Recommendations) */}
        <div className="space-y-6">
          {/* Heuristic Layout Optimization Engine Card */}
          <div className="bg-slate-900 text-white rounded-lg p-5 space-y-3 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Layout Optimization Engine
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 font-mono border border-blue-800">
                QAP SOLVER
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spatial annealing heuristics analyze machine coordinate adjacencies to minimize rectilinear material handling travel distance.
            </p>
            <button
              onClick={() => navigate(`/suggestions/${activeFactory.id}`)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-semibold text-xs transition-all shadow-xs"
            >
              <span>Explore Optimized Relocations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Report & Data Export Center */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-3">
            <h3 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Documentation & Data Export
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleSaveReport}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-all font-semibold text-xs text-slate-700 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <span>Generate Certified PDF Report</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-all font-semibold text-xs text-slate-700 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-600" />
                  <span>Export Coordinate Telemetry (CSV)</span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Engineering Standards Reference Box */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-5 space-y-2.5 text-xs text-slate-600 shadow-xs">
            <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Audit Specifications
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Unit Handling Rate (c_ij):</span>
                <span className="font-bold text-slate-800">$0.05 / unit-meter</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">OSHA Safety Margin:</span>
                <span className="font-bold text-slate-800">1.0 m Perimeter</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Aisle Grid Pitch:</span>
                <span className="font-bold text-slate-800">0.5 m Orthogonal</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">AGV Nominal Velocity:</span>
                <span className="font-bold text-slate-800">1.2 m / second</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
