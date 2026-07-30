/**
 * Layout Distance & Efficiency Calculation Utilities
 */

/**
 * Calculates Manhattan distance between two machines: |x2 - x1| + |y2 - y1|
 */
export function getManhattanDistance(m1, m2) {
  if (!m1 || !m2) return 0;
  return Math.abs(m2.x - m1.x) + Math.abs(m2.y - m1.y);
}

/**
 * Calculates Euclidean distance between two machines: sqrt((x2 - x1)^2 + (y2 - y1)^2)
 */
export function getEuclideanDistance(m1, m2) {
  if (!m1 || !m2) return 0;
  const dx = m2.x - m1.x;
  const dy = m2.y - m1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Computes material travel efficiency rating based on total distance
 */
export function calculateEfficiencyRating(totalDistance) {
  if (totalDistance <= 0) return { efficiency: 100, rating: 'Optimal' };
  const efficiency = Math.max(10, Math.min(100, 100 - totalDistance * 0.5));
  let rating = 'Poor';
  if (efficiency >= 85) rating = 'Optimal';
  else if (efficiency >= 70) rating = 'Good';
  else if (efficiency >= 50) rating = 'Moderate';
  return { efficiency: parseFloat(efficiency.toFixed(2)), rating };
}
