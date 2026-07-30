import React from 'react';
import { Flame } from 'lucide-react';

export default function HeatmapLegend({ show }) {
  if (!show) return null;

  return (
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
  );
}
