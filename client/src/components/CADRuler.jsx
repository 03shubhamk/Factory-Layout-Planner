import React from 'react';

/**
 * Architectural CAD Metric Rulers
 * Calibrated in real physical meters with major (5m), minor (1m), and sub-meter ticks.
 */
export function TopRuler({ length, widthPx, isDark = true, cursorMetersX = null }) {
  if (!length || !widthPx) return null;

  const meters = Math.ceil(length);
  const pxPerMeter = widthPx / length;

  // Major ticks every 5m or 10m based on resolution
  const majorInterval = length > 80 ? 10 : 5;
  const ticks = [];

  for (let m = 0; m <= meters; m += 1) {
    const isMajor = m % majorInterval === 0;
    const isFive = m % 5 === 0;
    const leftPx = m * pxPerMeter;

    ticks.push(
      <div 
        key={`top-tick-${m}`} 
        className="absolute bottom-0 flex flex-col items-center pointer-events-none"
        style={{ left: `${leftPx}px` }}
      >
        <span 
          className={`w-[1px] ${
            isMajor 
              ? isDark ? 'h-3 bg-slate-400' : 'h-3 bg-slate-600'
              : isFive
                ? isDark ? 'h-2 bg-slate-600' : 'h-2 bg-slate-400'
                : isDark ? 'h-1.5 bg-slate-700/80' : 'h-1.5 bg-slate-300'
          }`} 
        />
        {isMajor && (
          <span className={`text-[8px] font-mono select-none -translate-y-4 font-semibold ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {m}m
          </span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`h-5 border-b relative select-none overflow-visible shrink-0 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}
      style={{ width: `${widthPx}px` }}
    >
      {ticks}
      {cursorMetersX !== null && (
        <div 
          className="absolute top-0 bottom-0 w-[1px] bg-cyan-400 z-10 pointer-events-none"
          style={{ left: `${cursorMetersX * pxPerMeter}px` }}
        />
      )}
    </div>
  );
}

export function LeftRuler({ width, heightPx, isDark = true, cursorMetersY = null }) {
  if (!width || !heightPx) return null;

  const meters = Math.ceil(width);
  const pxPerMeter = heightPx / width;
  const majorInterval = width > 50 ? 10 : 5;
  const ticks = [];

  for (let m = 0; m <= meters; m += 1) {
    const isMajor = m % majorInterval === 0;
    const isFive = m % 5 === 0;
    const topPx = m * pxPerMeter;

    ticks.push(
      <div 
        key={`left-tick-${m}`} 
        className="absolute right-0 flex items-center pointer-events-none"
        style={{ top: `${topPx}px` }}
      >
        {isMajor && (
          <span className={`text-[8px] font-mono select-none -translate-x-1 font-semibold ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {m}m
          </span>
        )}
        <span 
          className={`h-[1px] ${
            isMajor 
              ? isDark ? 'w-3 bg-slate-400' : 'w-3 bg-slate-600'
              : isFive
                ? isDark ? 'w-2 bg-slate-600' : 'w-2 bg-slate-400'
                : isDark ? 'w-1.5 bg-slate-700/80' : 'w-1.5 bg-slate-300'
          }`} 
        />
      </div>
    );
  }

  return (
    <div 
      className={`w-6 border-r relative select-none overflow-visible shrink-0 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}
      style={{ height: `${heightPx}px` }}
    >
      {ticks}
      {cursorMetersY !== null && (
        <div 
          className="absolute left-0 right-0 h-[1px] bg-cyan-400 z-10 pointer-events-none"
          style={{ top: `${cursorMetersY * pxPerMeter}px` }}
        />
      )}
    </div>
  );
}

