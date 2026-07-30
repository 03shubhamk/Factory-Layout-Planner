import React from 'react';

export default function StatusBadge({ status, health }) {
  const getBadgeStyle = () => {
    if (status === 'Running') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status === 'Idle') {
      return 'bg-slate-100 text-slate-600 border-slate-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getBadgeStyle()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
      <span>{status}</span>
    </span>
  );
}
