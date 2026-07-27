import { calculateManhattanDistance, calculateEfficiency } from './calculations.js';

/**
 * Dynamically analyzes layout and returns optimization suggestions.
 * @param {Array} machines - List of machines in factory
 * @param {Array} flowSteps - Production flow sequence
 * @param {number} factoryLength - Total factory length in meters
 * @param {number} factoryWidth - Total factory width in meters
 * @returns {Array} List of suggestions
 */
export function generateSuggestions(machines, flowSteps, factoryLength = 50, factoryWidth = 30) {
  const suggestions = [];

  if (!machines || machines.length === 0) return suggestions;

  // 1. Flow Bottleneck Analysis (Consecutive steps with distance > 8 meters)
  if (flowSteps && flowSteps.length >= 2) {
    for (let i = 0; i < flowSteps.length - 1; i++) {
      const stepA = flowSteps[i];
      const stepB = flowSteps[i + 1];
      
      const machA = machines.find(m => m.id === stepA.machineId || m.id === stepA);
      const machB = machines.find(m => m.id === stepB.machineId || m.id === stepB);

      if (machA && machB) {
        const dist = calculateManhattanDistance(machA.x, machA.y, machB.x, machB.y);
        
        if (dist > 8) {
          // Calculate proposed coordinate for B adjacent to A (within 3m)
          // We check which direction is free, or just place it at A.x + 3, A.y (clamped to factory bounds)
          let proposedX = machA.x + 3;
          let proposedY = machA.y;
          if (proposedX > factoryLength) {
            proposedX = machA.x - 3;
          }
          proposedX = Math.max(1, Math.min(factoryLength - 1, proposedX));
          proposedY = Math.max(1, Math.min(factoryWidth - 1, proposedY));

          const proposedDist = calculateManhattanDistance(machA.x, machA.y, proposedX, proposedY);
          const savedDistance = parseFloat((dist - proposedDist).toFixed(1));

          if (savedDistance > 1) {
            suggestions.push({
              id: `flow-${machA.id}-${machB.id}`,
              title: `Relocate ${machB.machineName}`,
              description: `${machB.machineName} is currently ${dist.toFixed(1)}m from ${machA.machineName}. Repositioning it closer (e.g., to ${proposedX.toFixed(1)}m, ${proposedY.toFixed(1)}m) will streamline the production flow.`,
              estimatedSaving: savedDistance,
              priority: dist > 20 ? 'High' : 'Medium',
              tag: dist > 20 ? 'HIGH IMPACT' : 'FLOW',
              type: 'flow',
              targetMachineId: machB.id,
              suggestedCoords: { x: proposedX, y: proposedY }
            });
          }
        }
      }
    }
  }

  // 2. Logistics Proximity (Warehouse -> Packaging)
  const packagingNode = machines.find(m => m.machineType.toLowerCase().includes('packaging'));
  const warehouseNode = machines.find(m => m.machineType.toLowerCase().includes('warehouse'));

  if (packagingNode && warehouseNode) {
    const dist = calculateManhattanDistance(packagingNode.x, packagingNode.y, warehouseNode.x, warehouseNode.y);
    if (dist > 6) {
      let proposedX = packagingNode.x + 2;
      let proposedY = packagingNode.y;
      if (proposedX > factoryLength) {
        proposedX = packagingNode.x - 2;
      }
      proposedX = Math.max(1, Math.min(factoryLength - 1, proposedX));
      proposedY = Math.max(1, Math.min(factoryWidth - 1, proposedY));

      const proposedDist = calculateManhattanDistance(packagingNode.x, packagingNode.y, proposedX, proposedY);
      const savedDistance = parseFloat((dist - proposedDist).toFixed(1));

      if (savedDistance > 1) {
        suggestions.push({
          id: 'logistics-warehouse-packaging',
          title: 'Warehouse & Packaging Proximity',
          description: `The Warehouse is located ${dist.toFixed(1)}m away from the Packaging station. Moving the Warehouse adjacent to Packaging will minimize final loading/unloading logistics travel.`,
          estimatedSaving: savedDistance,
          priority: 'Medium',
          tag: 'LOGISTICS',
          type: 'logistics',
          targetMachineId: warehouseNode.id,
          suggestedCoords: { x: proposedX, y: proposedY }
        });
      }
    }
  }

  // 3. Space Utilization Check (Empty Quadrants)
  // Split factory floor into 4 quadrants
  const midX = factoryLength / 2;
  const midY = factoryWidth / 2;
  const quadrantCounts = { NW: 0, NE: 0, SW: 0, SE: 0 };

  machines.forEach(m => {
    if (m.x < midX && m.y < midY) quadrantCounts.NW++;
    else if (m.x >= midX && m.y < midY) quadrantCounts.NE++;
    else if (m.x < midX && m.y >= midY) quadrantCounts.SW++;
    else quadrantCounts.SE++;
  });

  const emptyQuadrants = Object.entries(quadrantCounts)
    .filter(([_, count]) => count === 0)
    .map(([quad, _]) => {
      switch (quad) {
        case 'NW': return 'North-West';
        case 'NE': return 'North-East';
        case 'SW': return 'South-West';
        case 'SE': return 'South-East';
        default: return '';
      }
    });

  if (emptyQuadrants.length > 0) {
    suggestions.push({
      id: 'space-utilization',
      title: 'Unused Area Detected',
      description: `A large area in the ${emptyQuadrants[0]} sector of the factory floor is currently unutilized (${quadrantCounts[emptyQuadrants[0]] || 0} machines). Consider reallocating it for material buffers, inventory storage, or maintenance cells.`,
      estimatedSaving: 1.5, // Standard layout credit rating
      priority: 'Low',
      tag: 'SPACE UTIL',
      type: 'space'
    });
  }

  // Fallback suggestion if layout is perfect or empty
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'optimal-layout',
      title: 'Optimal Layout Achieved',
      description: 'Your machines are arranged efficiently in logical sequence. Continue to monitor throughput and node loads to optimize further.',
      estimatedSaving: 0,
      priority: 'Low',
      tag: 'COMPLIANT',
      type: 'optimal'
    });
  }

  return suggestions;
}
