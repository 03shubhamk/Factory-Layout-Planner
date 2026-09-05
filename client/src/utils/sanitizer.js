/**
 * Input Sanitization & Coordinate Clamping Utilities
 */

export const Sanitizer = {
  sanitizeName: (input = '', maxLen = 60) => {
    return String(input)
      .trim()
      .replace(/[^a-zA-Z0-9 _\-#().]/g, '')
      .slice(0, maxLen);
  },

  clampCoordinates: (machine, factoryWidth = 50, factoryLength = 30) => {
    const width = Number(machine.width) || 2;
    const height = Number(machine.height) || 2;
    const x = Math.max(0, Math.min(factoryWidth - width, Number(machine.x) || 0));
    const y = Math.max(0, Math.min(factoryLength - height, Number(machine.y) || 0));
    return { ...machine, x, y, width, height };
  },

  sanitizePositiveNumber: (val, fallback = 0) => {
    const num = Number(val);
    return isNaN(num) || num < 0 ? fallback : num;
  }
};

export default Sanitizer;
