import React from 'react';

/**
 * Interactive CAD Minimap
 * Provides global spatial awareness with a live viewport frustum.
 */
export default function FactoryMinimap({ 
  factory, 
  machines, 
  flow, 
  viewportRef, 
  gridWidthPx,
  isDark = true 
}) {
  if (!factory) return null;

  const mapWidth = 160;
  const mapHeight = Math.round(mapWidth * (factory.width / factory.length));

  const scaleX = mapWidth / factory.length;
  const scaleY = mapHeight / factory.width;

  return (
    <div className={`p-2 rounded-lg border shadow-xl backdrop-blur-md select-none transition-all ${
      isDark 
        ? 'bg-slate-900/90 border-slate-700/80 text-slate-300' 
        : 'bg-white/90 border-slate-200 text-slate-700'
    }`}>
      <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider mb-1.5 uppercase opacity-75">
        <span>MINIMAP</span>
        <span>{factory.length}×{factory.width}m</span>
      </div>

      <div 
        className={`relative rounded border overflow-hidden ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
        }`}
        style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
      >
        <svg className="w-full h-full pointer-events-none">
          {/* Flow links */}
          {flow.length >= 2 && flow.map((step, idx) => {
            if (idx === flow.length - 1) return null;
            const next = flow[idx + 1];
            const mA = machines.find(m => m.id === step.machineId);
            const mB = machines.find(m => m.id === next.machineId);
            if (!mA || !mB) return null;

            return (
              <line 
                key={`map-flow-${idx}`}
                x1={mA.x * scaleX}
                y1={mA.y * scaleY}
                x2={mB.x * scaleX}
                y2={mB.y * scaleY}
                stroke={isDark ? '#38BDF8' : '#2563EB'}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            );
          })}

          {/* Machine dots */}
          {machines.map((m) => {
            const cx = m.x * scaleX;
            const cy = m.y * scaleY;
            const color = m.status === 'Running' ? '#10B981' : m.status === 'Maintenance' ? '#EF4444' : '#94A3B8';

            return (
              <circle
                key={`map-m-${m.id}`}
                cx={cx}
                cy={cy}
                r="3"
                fill={color}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

