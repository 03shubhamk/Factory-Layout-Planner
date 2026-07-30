/**
 * Machine Asset & Status Helper Utilities
 */

export const MACHINE_TYPE_ICONS = {
  Input: '📦',
  Processing: '⚙️',
  Assembly: '🤝',
  Quality: '🔍',
  Logistics: '🗳️',
  Storage: '🗄️'
};

export function getMachineIcon(machineType) {
  return MACHINE_TYPE_ICONS[machineType] || '⚙️';
}

export function getMachineStatusColor(status) {
  switch (status) {
    case 'Running':
      return 'bg-emerald-500 text-emerald-700 border-emerald-200';
    case 'Idle':
      return 'bg-slate-400 text-slate-700 border-slate-200';
    case 'Maintenance':
      return 'bg-amber-500 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-400 text-slate-700 border-slate-200';
  }
}
