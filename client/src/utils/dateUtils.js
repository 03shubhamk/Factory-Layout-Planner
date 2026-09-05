/**
 * Date & Time / MES Shift Timing Helpers
 */

export const DateUtils = {
  formatIsoTimestamp: (date = new Date()) => {
    return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
  },

  formatShiftTime: (date = new Date()) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  },

  getShiftName: (hour = new Date().getHours()) => {
    if (hour >= 6 && hour < 14) return 'Shift A (Morning)';
    if (hour >= 14 && hour < 22) return 'Shift B (Evening)';
    return 'Shift C (Night)';
  },

  formatDurationHuman: (seconds) => {
    if (!seconds || seconds <= 0) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    return parts.join(' ');
  }
};

export default DateUtils;
