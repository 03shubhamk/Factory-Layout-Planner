/**
 * Factory Heatmap & Machine Status Color Scales
 */

export const ColorScales = {
  STATUS_COLORS: {
    optimal: '#10b981', // Emerald 500
    running: '#3b82f6', // Blue 500
    warning: '#f59e0b', // Amber 500
    critical: '#ef4444', // Red 500
    offline: '#6b7280',  // Gray 500
    maintenance: '#8b5cf6' // Violet 500
  },

  /**
   * Interpolates RGB values between green (0), yellow (0.5), and red (1.0)
   * @param {number} t Factor between 0.0 (healthy) and 1.0 (critical)
   */
  getHealthGradientColor: (t) => {
    const clamped = Math.max(0, Math.min(1, t));
    if (clamped < 0.5) {
      // Green to Yellow
      const ratio = clamped * 2;
      const r = Math.round(16 + ratio * (245 - 16));
      const g = Math.round(185 + ratio * (158 - 185));
      const b = Math.round(129 + ratio * (11 - 129));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to Red
      const ratio = (clamped - 0.5) * 2;
      const r = Math.round(245 + ratio * (239 - 245));
      const g = Math.round(158 + ratio * (68 - 158));
      const b = Math.round(11 + ratio * (68 - 11));
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
};

export default ColorScales;
