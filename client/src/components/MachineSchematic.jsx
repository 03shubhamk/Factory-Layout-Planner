import React from 'react';

/**
 * Top-Down 2D Industrial CAD Schematic Vectors
 * Replaces generic emojis with precision engineering silhouettes.
 */
export default function MachineSchematic({ type, status, isSelected, isDark = true }) {
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

  switch (type) {
    case 'Input':
      // Raw Material / Loading Dock / Pallet Ingress
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Base staging pallet */}
          <rect x="4" y="6" width="40" height="24" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Pallet slats */}
          <line x1="14" y1="6" x2="14" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="24" y1="6" x2="24" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="34" y1="6" x2="34" y2="30" stroke={strokeColor} strokeWidth="1" strokeDasharray="2,2" />
          {/* Incoming direction chevrons */}
          <path d="M18 18 L24 22 L30 18" fill="none" stroke={highlightColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="12" r="2.5" fill={highlightColor} />
        </svg>
      );

    case 'Processing':
      // 5-Axis CNC Mill / Machining Center
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Main Enclosure */}
          <rect x="4" y="4" width="40" height="28" rx="3" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Safety glass observation window */}
          <rect x="12" y="8" width="24" height="18" rx="1.5" fill={fillAccent} stroke={strokeColor} strokeWidth="1" />
          {/* Spindle Worktable */}
          <rect x="16" y="12" width="16" height="10" rx="1" fill={fillMain} stroke={strokeColor} strokeWidth="0.8" />
          {/* Spindle Crosshair Center */}
          <circle cx="24" cy="17" r="3.5" fill="none" stroke={highlightColor} strokeWidth="1.2" />
          <circle cx="24" cy="17" r="1" fill={highlightColor} />
          <line x1="24" y1="11" x2="24" y2="23" stroke={highlightColor} strokeWidth="0.8" />
          <line x1="18" y1="17" x2="30" y2="17" stroke={highlightColor} strokeWidth="0.8" />
          {/* Control Console on Side */}
          <rect x="38" y="10" width="3" height="8" rx="0.5" fill={highlightColor} />
        </svg>
      );

    case 'Assembly':
      // Articulated Robotic Arm Workcell
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Workcell base ring perimeter */}
          <circle cx="24" cy="18" r="14" fill={fillMain} stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3,2" />
          {/* Heavy turntable pedestal */}
          <circle cx="24" cy="18" r="8" fill={fillAccent} stroke={strokeColor} strokeWidth="1.5" />
          {/* Robot Kinematic Link 1 */}
          <line x1="24" y1="18" x2="32" y2="12" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          {/* Robot Kinematic Link 2 */}
          <line x1="32" y1="12" x2="36" y2="20" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          {/* Swivel Pivot Joints */}
          <circle cx="24" cy="18" r="3" fill={highlightColor} />
          <circle cx="32" cy="12" r="2" fill={strokeColor} />
          {/* End-Effector / Tooling Head */}
          <circle cx="36" cy="20" r="2.5" fill={highlightColor} />
          <path d="M36 17 L38 20 L36 23" fill="none" stroke={highlightColor} strokeWidth="1" />
        </svg>
      );

    case 'Quality':
      // Automated Optical / CMM Coordinate Inspection Station
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Precision Granite Datum Table */}
          <rect x="6" y="6" width="36" height="24" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Scanner Bridge Gantry */}
          <line x1="10" y1="6" x2="10" y2="30" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="38" y1="6" x2="38" y2="30" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="10" y1="18" x2="38" y2="18" stroke={strokeColor} strokeWidth="2" />
          {/* Optical Sensor Head with Laser Sweep */}
          <rect x="21" y="14" width="6" height="8" rx="1" fill={fillAccent} stroke={highlightColor} strokeWidth="1.2" />
          <line x1="12" y1="18" x2="36" y2="18" stroke={highlightColor} strokeWidth="1" strokeDasharray="1.5,1.5" />
          {/* Sensor Lens */}
          <circle cx="24" cy="18" r="1.5" fill={highlightColor} />
        </svg>
      );

    case 'Logistics':
      // Automated Conveyor & Packaging Cell
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Conveyor Bed Guide Rails */}
          <rect x="4" y="8" width="40" height="20" rx="2" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Transverse Rollers */}
          {[8, 14, 20, 26, 32, 38].map((rx) => (
            <line key={rx} x1={rx} y1="8" x2={rx} y2="28" stroke={strokeColor} strokeWidth="1" />
          ))}
          {/* Strapping / Sealing Gateway Arch */}
          <rect x="20" y="5" width="8" height="26" rx="1.5" fill={fillAccent} stroke={highlightColor} strokeWidth="1.2" />
          <circle cx="24" cy="18" r="2" fill={highlightColor} />
        </svg>
      );

    case 'Storage':
      // Modular High-Bay Warehouse Racking
      return (
        <svg viewBox="0 0 48 36" className="w-full h-full p-0.5 select-none pointer-events-none">
          {/* Rack Outer Perimeter */}
          <rect x="4" y="6" width="40" height="24" rx="1" fill={fillMain} stroke={strokeColor} strokeWidth="1.5" />
          {/* Bay Compartment Dividers */}
          <line x1="17" y1="6" x2="17" y2="30" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="31" y1="6" x2="31" y2="30" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="4" y1="18" x2="44" y2="18" stroke={strokeColor} strokeWidth="1.2" />
          {/* Stored Pallet Blocks */}
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

