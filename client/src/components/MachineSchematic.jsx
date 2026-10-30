import React from 'react';

/**
 * Top-Down 2D Industrial CAD Schematic Vectors
 * Replaces generic emojis with precision engineering silhouettes.
 * Supports domain-specific machinery for Water Purification, Automotive, Electronics, and Pharma.
 */
export default function MachineSchematic({ type, name = '', schematicType, status, isSelected, isDark = true }) {
  const strokeColor = isDark 
    ? (isSelected ? '#60A5FA' : '#94A3B8') 
    : (isSelected ? '#2563EB' : '#475569');
  
  const fillMain = isDark ? '#1E293B' : '#F1F5F9';
  const fillAccent = isDark ? '#0F172A' : '#E2E8F0';
  const highlightColor = status === 'Running' 
    ? '#10B981' 
    : status === 'Maintenance' 
      ? '#EF4444' 
      : '#94A3B8';

  // Determine effective schematic CAD model
  let effectiveType = schematicType || type;
  const lowerName = (name || '').toLowerCase();

  if (!schematicType) {
    if (lowerName.includes('tank') || lowerName.includes('reservoir') || lowerName.includes('intake')) {
      effectiveType = 'water_tank';
    } else if (lowerName.includes('filter') || lowerName.includes('clarifier') || lowerName.includes('flocculat') || lowerName.includes('ozone') || lowerName.includes('uv')) {
      effectiveType = 'water_filter';
    } else if (lowerName.includes('ro skid') || lowerName.includes('reverse osmosis') || lowerName.includes('membrane')) {
      effectiveType = 'water_ro';
    } else if (lowerName.includes('filler') || lowerName.includes('monoblock') || lowerName.includes('rinser') || lowerName.includes('capper')) {
      effectiveType = 'water_filler';
    }
  }

  switch (effectiveType) {
    case 'water_tank':
      // Cylindrical Dual-Walled Storage Reservoir with Level Sight Glass & Fluid Baffles
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Tank Outer Shell */}
          <rect x="4" y="5" width="40" height="26" rx="4" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Cylindrical Domed End Visuals */}
          <ellipse cx="10" cy="18" rx="4" ry="11" fill={fillAccent} stroke={strokeColor} strokeWidth="1" />
          <ellipse cx="38" cy="18" rx="4" ry="11" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          {/* Internal Fluid Level Waves */}
          <path 
            d="M 16 16 Q 22 13 28 16 T 40 16" 
            fill="none" 
            stroke="#38BDF8" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
          />
          <path 
            d="M 16 20 Q 22 17 28 20 T 40 20" 
            fill="none" 
            stroke="#0284C7" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
          />
          {/* Top Flange / Manhole */}
          <rect x="21" y="2" width="6" height="3" rx="0.5" fill={fillAccent} stroke={strokeColor} strokeWidth="1" />
          {/* Liquid Level Indicator Column on Side */}
          <rect x="7" y="10" width="3" height="16" rx="0.5" fill={fillAccent} stroke={highlightColor} strokeWidth="0.8" />
          <line x1="7" y1="14" x2="10" y2="14" stroke={highlightColor} strokeWidth="0.8" />
          <line x1="7" y1="18" x2="10" y2="18" stroke={highlightColor} strokeWidth="0.8" />
          <line x1="7" y1="22" x2="10" y2="22" stroke={highlightColor} strokeWidth="0.8" />
          {/* Status Indicator Nozzle */}
          <circle cx="34" cy="18" r="2" fill={highlightColor} />
        </svg>
      );

    case 'water_filter':
      // Multi-Media Sand & Carbon Pressurized Filter Vessels with Manifold
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Base Skid Frame */}
          <rect x="3" y="27" width="42" height="5" rx="1" fill={fillAccent} stroke={strokeColor} strokeWidth="1" />
          {/* Vessel 1 (Multi-Media Sand Filter) */}
          <rect x="6" y="6" width="16" height="21" rx="3" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Vessel 2 (Activated Carbon Filter) */}
          <rect x="26" y="6" width="16" height="21" rx="3" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Interconnecting Upper Manifold Header Pipe */}
          <line x1="14" y1="9" x2="34" y2="9" stroke={strokeColor} strokeWidth="2.5" />
          {/* Center Isolation Valve Wheel */}
          <circle cx="24" cy="9" r="2.5" fill={fillAccent} stroke={highlightColor} strokeWidth="1" />
          {/* Pressure Gauges with Needles */}
          <circle cx="14" cy="4" r="3" fill={fillAccent} stroke={highlightColor} strokeWidth="1" />
          <line x1="14" y1="4" x2="15.5" y2="2.5" stroke={highlightColor} strokeWidth="0.8" />
          <circle cx="34" cy="4" r="3" fill={fillAccent} stroke={highlightColor} strokeWidth="1" />
          <line x1="34" y1="4" x2="35.5" y2="2.5" stroke={highlightColor} strokeWidth="0.8" />
          {/* Bottom Backwash Drain Pipe */}
          <line x1="14" y1="27" x2="34" y2="27" stroke={strokeColor} strokeWidth="2" strokeDasharray="3,2" />
        </svg>
      );

    case 'water_ro':
      // Industrial 4-Stage Reverse Osmosis Skid (Stacked Horizontal Membrane Vessels)
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Stainless Skid Base Frame */}
          <rect x="3" y="4" width="42" height="28" rx="2" fill={fillAccent} stroke={strokeColor} strokeWidth="1.2" />
          {/* 3 Horizontal Membrane Pressure Vessels */}
          <rect x="6" y="7" width="28" height="5.5" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.2" />
          <rect x="6" y="15" width="28" height="5.5" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.2" />
          <rect x="6" y="23" width="28" height="5.5" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.2" />
          {/* Membrane Clamp Bands */}
          <line x1="13" y1="7" x2="13" y2="28.5" stroke={strokeColor} strokeWidth="1" />
          <line x1="27" y1="7" x2="27" y2="28.5" stroke={strokeColor} strokeWidth="1" />
          {/* High-Pressure Grundfos Booster Pump */}
          <rect x="37" y="10" width="6" height="16" rx="1.5" fill={fillMain} stroke={highlightColor} strokeWidth="1.2" />
          {/* Pump Motor Fin Grooves */}
          <line x1="39" y1="13" x2="41" y2="13" stroke={highlightColor} strokeWidth="0.8" />
          <line x1="39" y1="18" x2="41" y2="18" stroke={highlightColor} strokeWidth="0.8" />
          <line x1="39" y1="23" x2="41" y2="23" stroke={highlightColor} strokeWidth="0.8" />
          {/* Permeate Tubing Interconnect */}
          <path d="M 34 9.5 L 37 9.5 L 37 12" fill="none" stroke="#38BDF8" strokeWidth="1" />
          <path d="M 34 25.5 L 37 25.5 L 37 24" fill="none" stroke="#38BDF8" strokeWidth="1" />
        </svg>
      );

    case 'water_filler':
      // High-Speed Rotary Rinser-Filler-Capper Monoblock (Starwheel Carousel)
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Cleanroom Stainless Enclosure Housing */}
          <rect x="4" y="4" width="40" height="28" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Main Rotary Filling Carousel (Turret) */}
          <circle cx="22" cy="18" r="10" fill={fillAccent} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="22" cy="18" r="4" fill={fillMain} stroke={strokeColor} strokeWidth="1" />
          {/* Filling Valves radially arranged */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 22 + 8 * Math.cos(rad);
            const cy = 18 + 8 * Math.sin(rad);
            return (
              <circle key={i} cx={cx} cy={cy} r="1.3" fill={highlightColor} />
            );
          })}
          {/* Rotary Infeed Starwheel */}
          <circle cx="36" cy="12" r="5" fill={fillAccent} stroke={strokeColor} strokeWidth="1" strokeDasharray="2,1.5" />
          {/* Rotary Capping Chuck */}
          <circle cx="36" cy="24" r="5" fill={fillAccent} stroke={highlightColor} strokeWidth="1.2" />
          <circle cx="36" cy="24" r="1.8" fill={highlightColor} />
          {/* Infeed Conveyor Guide Tracks */}
          <line x1="4" y1="12" x2="31" y2="12" stroke={strokeColor} strokeWidth="1" strokeDasharray="1,1" />
        </svg>
      );

    case 'Input':
      // Raw Material / Loading Dock / Pallet Ingress
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <rect x="4" y="6" width="40" height="24" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="14" y1="6" x2="14" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="24" y1="6" x2="24" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="34" y1="6" x2="34" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          <path d="M18 18 L24 22 L30 18" fill="none" stroke={highlightColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="12" r="2.5" fill={highlightColor} />
        </svg>
      );

    case 'Processing':
      // 5-Axis CNC Mill / Machining Center
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <rect x="4" y="4" width="40" height="28" rx="3" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          <rect x="12" y="8" width="24" height="18" rx="1.5" fill={fillAccent} stroke={strokeColor} strokeWidth="1" />
          <rect x="16" y="12" width="16" height="10" rx="1" fill={fillMain} stroke={strokeColor} strokeWidth="0.8" />
          <circle cx="24" cy="17" r="3.5" fill="none" stroke={highlightColor} strokeWidth="1.2" />
          <circle cx="24" cy="17" r="1" fill={highlightColor} />
          <line x1="24" y1="11" x2="24" y2="23" stroke={highlightColor} strokeWidth="0.8" />
          <line x1="18" y1="17" x2="30" y2="17" stroke={highlightColor} strokeWidth="0.8" />
          <rect x="38" y="10" width="3" height="8" rx="0.5" fill={highlightColor} />
        </svg>
      );

    case 'Assembly':
      // Articulated Robotic Arm Workcell
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <circle cx="24" cy="18" r="14" fill={fillMain} stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3,2" />
          <circle cx="24" cy="18" r="8" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="24" y1="18" x2="32" y2="12" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="12" x2="36" y2="20" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="18" r="3" fill={highlightColor} />
          <circle cx="32" cy="12" r="2" fill={strokeColor} />
          <circle cx="36" cy="20" r="2.5" fill={highlightColor} />
          <path d="M36 17 L38 20 L36 23" fill="none" stroke={highlightColor} strokeWidth="1" />
        </svg>
      );

    case 'Quality':
      // Automated Optical / CMM Coordinate Inspection Station
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <rect x="6" y="6" width="36" height="24" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="10" y1="6" x2="10" y2="30" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="38" y1="6" x2="38" y2="30" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="10" y1="18" x2="38" y2="18" stroke={strokeColor} strokeWidth="2" />
          <rect x="21" y="14" width="6" height="8" rx="1" fill={fillAccent} stroke={highlightColor} strokeWidth="1.2" />
          <line x1="12" y1="18" x2="36" y2="18" stroke={highlightColor} strokeWidth="1" strokeDasharray="1.5,1.5" />
          <circle cx="24" cy="18" r="1.5" fill={highlightColor} />
        </svg>
      );

    case 'Logistics':
      // Automated Conveyor & Packaging Cell
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <rect x="4" y="8" width="40" height="20" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {[8, 14, 20, 26, 32, 38].map((rx) => (
            <line key={rx} x1={rx} y1="8" x2={rx} y2="28" stroke={strokeColor} strokeWidth="1" />
          ))}
          <rect x="20" y="5" width="8" height="26" rx="1.5" fill={fillAccent} stroke={highlightColor} strokeWidth="1.2" />
          <circle cx="24" cy="18" r="2" fill={highlightColor} />
        </svg>
      );

    case 'Storage':
      // Modular High-Bay Warehouse Racking
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <rect x="4" y="6" width="40" height="24" rx="1" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="17" y1="6" x2="17" y2="30" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="31" y1="6" x2="31" y2="30" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="4" y1="18" x2="44" y2="18" stroke={strokeColor} strokeWidth="1.2" />
          <rect x="6" y="8" width="9" height="8" rx="1" fill={fillAccent} />
          <rect x="19" y="8" width="10" height="8" rx="1" fill={fillAccent} />
          <rect x="33" y="20" width="9" height="8" rx="1" fill={fillAccent} />
          <circle cx="24" cy="24" r="2" fill={highlightColor} />
        </svg>
      );

    default:
      // General Industrial Machine
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          <rect x="6" y="6" width="36" height="24" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="24" cy="18" r="6" fill={fillAccent} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="24" cy="18" r="2" fill={highlightColor} />
        </svg>
      );
  }
}
