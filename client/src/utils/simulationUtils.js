/**
 * Simulation Speed & Flow Calculation Utilities
 */

export const SIMULATION_SPEEDS = [
  { label: '1x', multiplier: 1, description: 'Standard Real-time Pace' },
  { label: '2x', multiplier: 2, description: 'Accelerated Pace' },
  { label: '4x', multiplier: 4, description: 'Maximum Velocity' }
];

export function calculateParticleDuration(throughput, simSpeed) {
  const baseThroughput = throughput || 100;
  return Math.max(0.8, 5 / (simSpeed * (baseThroughput / 100)));
}

export function calculateManhattanDistance(m1, m2) {
  if (!m1 || !m2) return 0;
  return Math.abs(m2.x - m1.x) + Math.abs(m2.y - m1.y);
}
