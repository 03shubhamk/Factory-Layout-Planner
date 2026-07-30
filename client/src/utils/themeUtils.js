/**
 * UI Theme & Accent Styling Utilities
 */

export function getMachineCategoryTheme(type) {
  switch (type) {
    case 'Input':
      return { border: 'border-blue-300', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-500' };
    case 'Processing':
      return { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-500' };
    case 'Assembly':
      return { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-500' };
    case 'Quality':
      return { border: 'border-purple-300', bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-500' };
    case 'Logistics':
      return { border: 'border-pink-300', bg: 'bg-pink-50', text: 'text-pink-700', badge: 'bg-pink-500' };
    default:
      return { border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-500' };
  }
}
