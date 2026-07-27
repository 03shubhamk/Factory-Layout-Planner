/**
 * Calculates the Manhattan Distance between two points (in meters)
 * Distance = |x2 - x1| + |y2 - y1|
 */
export function calculateManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Calculates the total material travel distance based on the production flow sequence.
 * @param {Array} machines - List of machines in the factory
 * @param {Array} flowSteps - Array of flow steps containing machineId or machine object
 * @returns {number} Total distance in meters
 */
export function calculateTotalDistance(machines, flowSteps) {
  if (!flowSteps || flowSteps.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 0; i < flowSteps.length - 1; i++) {
    const stepA = flowSteps[i];
    const stepB = flowSteps[i + 1];
    
    // Find machines associated with steps
    const machA = machines.find(m => m.id === stepA.machineId || m.id === stepA);
    const machB = machines.find(m => m.id === stepB.machineId || m.id === stepB);
    
    if (machA && machB) {
      const dist = calculateManhattanDistance(machA.x, machA.y, machB.x, machB.y);
      totalDistance += dist;
    }
  }
  
  return parseFloat(totalDistance.toFixed(2));
}

/**
 * Calculates layout efficiency based on material travel distance.
 * Efficiency = 100 - (Distance * 0.5)
 * Minimum = 0, Maximum = 100
 */
export function calculateEfficiency(distance) {
  if (distance === 0) return 100;
  const rawEfficiency = 100 - (distance * 0.5);
  return Math.max(0, Math.min(100, parseFloat(rawEfficiency.toFixed(1))));
}

/**
 * Returns rating tier based on efficiency score.
 * 90-100: Excellent
 * 75-89: Good
 * 60-74: Average
 * Below 60: Poor
 */
export function getLayoutRating(efficiency) {
  if (efficiency >= 90) return 'Excellent';
  if (efficiency >= 75) return 'Good';
  if (efficiency >= 60) return 'Average';
  return 'Poor';
}

/**
 * Calculates layout metrics summary.
 */
export function calculateLayoutMetrics(machines, flowSteps) {
  const totalDistance = calculateTotalDistance(machines, flowSteps);
  const efficiency = calculateEfficiency(totalDistance);
  const rating = getLayoutRating(efficiency);
  const averageDistance = flowSteps.length > 1 ? parseFloat((totalDistance / (flowSteps.length - 1)).toFixed(2)) : 0;
  
  return {
    totalDistance,
    averageDistance,
    efficiency,
    rating,
    machineCount: machines.length,
    travelTime: parseFloat((totalDistance * 1.2).toFixed(1)) // Assuming 1.2s per meter travel speed
  };
}
