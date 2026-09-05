/**
 * 2D Geometry & Spatial Vector Math Utilities
 */

export const MathUtils = {
  euclideanDistance: (x1, y1, x2, y2) => {
    return Math.hypot(x2 - x1, y2 - y1);
  },

  manhattanDistance: (x1, y1, x2, y2) => {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  },

  clamp: (val, min, max) => {
    return Math.max(min, Math.min(max, val));
  },

  rectIntersectsRect: (r1, r2) => {
    return !(
      r2.x >= r1.x + r1.width ||
      r2.x + r2.width <= r1.x ||
      r2.y >= r1.y + r1.height ||
      r2.y + r2.height <= r1.y
    );
  },

  calculateCentroid: (points) => {
    if (!points || points.length === 0) return { x: 0, y: 0 };
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return {
      x: sum.x / points.length,
      y: sum.y / points.length
    };
  }
};

export default MathUtils;
