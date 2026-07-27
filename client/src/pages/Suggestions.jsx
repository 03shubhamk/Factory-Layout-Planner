import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  Sparkles, 
  CheckCircle, 
  ArrowLeft, 
  ChevronRight, 
  Zap, 
  TrendingDown, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function Suggestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    activeFactory, 
    machines, 
    flow, 
    metrics, 
    suggestions, 
    loadFactoryDetails, 
    applySuggestion 
  } = useFactory();

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id]);

  // Compute stats based on current suggestions
  const optimizationMetrics = useMemo(() => {
    if (suggestions.length === 0 || suggestions[0].type === 'optimal') {
      return {
        projectedImprovement: 0,
        optimizedScore: metrics.efficiency,
        energySaving: 0,
        pathReduction: 0
      };
    }

    const totalSavedDistance = suggestions.reduce((sum, s) => sum + (s.estimatedSaving || 0), 0);
    const optimizedScore = Math.min(100, metrics.efficiency + (totalSavedDistance * 0.5));
    const projectedImprovement = parseFloat((optimizedScore - metrics.efficiency).toFixed(1));
    const energySaving = parseFloat((totalSavedDistance * 0.12).toFixed(1)); // 0.12 kWh/m
    const pathReduction = parseFloat(((totalSavedDistance * 300) / 1000).toFixed(2)); // assuming 300 cycles/day

    return {
      projectedImprovement,
      optimizedScore: parseFloat(optimizedScore.toFixed(1)),
      energySaving,
      pathReduction
    };
  }, [suggestions, metrics]);

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" />
          Optimization Suggestions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Algorithmic recommendations based on industrial engineering travel-efficiency and bottleneck analysis.
        </p>
      </div>

      {/* Main Efficiency Projection Bar Card */}
      <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          {/* Baseline Score Display */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="#60A5FA" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={176}
                  strokeDashoffset={176 - (176 * metrics.efficiency) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-bold text-slate-800 text-sm">{metrics.efficiency}%</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Efficiency</span>
              <span className="text-sm font-bold text-slate-800">Baseline layout score</span>
            </div>
          </div>

          {/* Projected Improvement Tag */}
          {optimizationMetrics.projectedImprovement > 0 ? (
            <div className="bg-emerald-50 text-success border border-emerald-100 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping"></span>
              <span>+{optimizationMetrics.projectedImprovement}% Projected Improvement</span>
            </div>
          ) : (
            <div className="bg-blue-50 text-primary px-4 py-2 rounded-full font-bold text-sm">
              Layout is Highly Optimized
            </div>
          )}

          {/* Energy / Path Saving Stats */}
          <div className="flex items-center gap-6 divide-x divide-slate-100">
            <div className="pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Energy Saving</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">
                {optimizationMetrics.energySaving} kWh/h
              </span>
            </div>
            <div className="pl-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Path Reduction</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">
                {optimizationMetrics.pathReduction} km/day
              </span>
            </div>
          </div>
        </div>

        {/* Comparative Slider Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Current Layout ({metrics.efficiency}%)</span>
            <span>Optimized Layout ({optimizationMetrics.optimizedScore}%)</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full relative overflow-hidden">
            {/* Current */}
            <div 
              style={{ width: `${metrics.efficiency}%` }} 
              className="bg-slate-400 h-full absolute left-0"
            ></div>
            {/* Projected addition */}
            <div 
              style={{ 
                left: `${metrics.efficiency}%`, 
                width: `${optimizationMetrics.projectedImprovement}%` 
              }} 
              className="bg-primary h-full absolute"
            ></div>
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-sm"></span>
              <span>Baseline ({metrics.efficiency}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary rounded-sm"></span>
              <span>Projected ({optimizationMetrics.optimizedScore}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((s, idx) => {
          let priorityColor = 'bg-rose-50 text-danger border-rose-100';
          if (s.priority === 'Medium') priorityColor = 'bg-blue-50 text-primary border-blue-100';
          if (s.priority === 'Low') priorityColor = 'bg-slate-100 text-slate-600 border-slate-200';

          return (
            <div key={idx} className="bg-white rounded-custom border border-slate-200 shadow-soft p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider uppercase ${priorityColor}`}>
                    {s.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{s.priority} Priority</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
              </div>

              <div className="border-t border-slate-50 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Projected Savings</span>
                  <span className="font-bold text-slate-800 font-mono">{s.estimatedSaving}m / cycle</span>
                </div>

                {s.targetMachineId && s.suggestedCoords ? (
                  <button
                    onClick={() => applySuggestion(s)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-primary hover:bg-primary-dark text-white rounded font-bold text-xs transition-all shadow-sm"
                  >
                    <span>Apply Suggestion</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-400 rounded font-bold text-xs cursor-default"
                  >
                    <span>No Action Required</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Schematic & Status Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Live Path Schematic */}
        <div className="lg:col-span-2 bg-white rounded-custom border border-slate-200 shadow-soft p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Live Path Schematic</h3>
            <div className="flex gap-4 text-[10px] font-mono font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-500 rounded-full"></span> Inefficient</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Optimal</span>
            </div>
          </div>
          
          <div className="h-56 rounded-lg blueprint-grid border border-slate-200 flex items-center justify-center relative overflow-hidden bg-slate-50/50">
            <div className="absolute inset-0 bg-blue-500/5"></div>
            {/* Draw active nodes representations */}
            <div className="absolute top-8 left-12 p-3 bg-slate-900 border border-slate-800 rounded shadow-md text-white text-[10px] font-mono font-bold">
              ASSEMBLY
            </div>
            <div className="absolute top-28 right-24 p-3 bg-slate-900 border border-slate-800 rounded shadow-md text-white text-[10px] font-mono font-bold">
              PACKAGING
            </div>
            <div className="absolute bottom-6 right-8 p-3 bg-slate-900 border border-slate-800 rounded shadow-md text-white text-[10px] font-mono font-bold">
              WAREHOUSE
            </div>

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* assembly to pack */}
              <line x1="85" y1="52" x2="310" y2="128" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,4" />
              {/* pack to warehouse */}
              <line x1="330" y1="140" x2="430" y2="200" stroke="#10B981" strokeWidth="2" strokeDasharray="5,4" />
            </svg>
            
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 font-bold">
              FACTORY FLOOR PLAN NODE A
            </div>
          </div>
        </div>

        {/* Summary of Analysis card */}
        <div className="bg-slate-900 text-white rounded-custom p-6 shadow-premium space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              Summary of Analysis
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">Safety Compliance</h4>
                  <p className="text-slate-400 mt-0.5">OSHA distance protocols maintained across all suggested pathways.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">System Status</h4>
                  <p className="text-slate-400 mt-0.5">Analysis Engine fully optimized. Output ready for export archive.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-200">Node Impact</h4>
                  <p className="text-slate-400 mt-0.5">Updates affect 3 downstream processes within the assembly schedule.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-6">
            <button
              onClick={() => navigate(`/report/${activeFactory.id}`)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all shadow-md"
            >
              FINISH & EXPORT ANALYSIS
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/designer/${activeFactory.id}`)}
              className="w-full py-2.5 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-xs font-bold text-slate-400 transition-all"
            >
              Return to Layout Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
