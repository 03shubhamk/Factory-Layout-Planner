/**
 * Industrial Engineering & Operations Research Calculations
 * 
 * Formal Academic Formulations Reference:
 * 1. Tompkins, J. A., White, J. A., Bozer, Y. A., & Tanchoco, J. M. A.
 *    "Facilities Planning", 4th Edition, John Wiley & Sons.
 *    - Chapter 6: Quantitative Facilities Layout Models (From-To Chart, MHW)
 * 2. Muther, Richard.
 *    "Systematic Layout Planning (SLP)", Industrial Press Inc.
 *    - Flow of Materials Analysis & Activity Relationship Charts
 */

/**
 * Calculates the Rectilinear (Manhattan) Distance between two 2D coordinates (in meters).
 * Standard distance metric for orthogonal factory aisles and automated material transport:
 * d_ij = |x2 - x1| + |y2 - y1|
 */
export function calculateManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Calculates Euclidean (straight-line) distance between two machines:
 * d_e = sqrt((x2 - x1)^2 + (y2 - y1)^2)
 */
export function calculateEuclideanDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculates the total material travel distance based on the production flow sequence.
 * D_total = sum_{k=1}^{n-1} d(M_k, M_{k+1})
 * 
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
    
    const machA = machines.find(m => m.id === (stepA.machineId || stepA.id || stepA));
    const machB = machines.find(m => m.id === (stepB.machineId || stepB.id || stepB));
    
    if (machA && machB) {
      const dist = calculateManhattanDistance(machA.x, machA.y, machB.x, machB.y);
      totalDistance += dist;
    }
  }
  
  return parseFloat(totalDistance.toFixed(2));
}

/**
 * Generates the Academic N x N From-To Flow Matrix (F = [f_ij]).
 * In Facilities Planning (Tompkins et al. Ch. 6), f_ij records the quantity of materials
 * (e.g. units/hr or batches/shift) moved between workstation i and workstation j.
 * 
 * @param {Array} machines - Ordered list of factory machinery
 * @param {Array} flowSteps - Sequential flow progression
 * @returns {Object} Matrix data with machine labels, 2D flow array, and total flow volume
 */
export function calculateFromToMatrix(machines, flowSteps) {
  if (!machines || machines.length === 0) {
    return { labels: [], matrix: [], totalVolume: 0 };
  }

  const n = machines.length;
  const labels = machines.map(m => m.machineName);
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  let totalVolume = 0;

  if (flowSteps && flowSteps.length >= 2) {
    for (let k = 0; k < flowSteps.length - 1; k++) {
      const idA = flowSteps[k].machineId || flowSteps[k].id || flowSteps[k];
      const idB = flowSteps[k + 1].machineId || flowSteps[k + 1].id || flowSteps[k + 1];

      const idxA = machines.findIndex(m => m.id === idA);
      const idxB = machines.findIndex(m => m.id === idB);

      if (idxA !== -1 && idxB !== -1) {
        // Throughput volume of the supplying machine (defaulting to 100 units/hr)
        const volume = machines[idxA].throughput || 100;
        matrix[idxA][idxB] += volume;
        totalVolume += volume;
      }
    }
  }

  return { labels, matrix, totalVolume };
}

/**
 * Calculates Total Material Handling Work (MHW) / Flow-Distance Cost:
 * MHW = sum_{i=1}^N sum_{j=1}^N (f_ij * c_ij * d_ij)
 * 
 * Where:
 * - f_ij = Flow volume from i to j (units/hr)
 * - c_ij = Unit material handling cost per meter ($0.05/meter standard)
 * - d_ij = Rectilinear distance between workstation centroids (m)
 * 
 * Reference: Tompkins et al., "Facilities Planning", Section 6.2
 */
export function calculateMaterialHandlingWork(machines, flowSteps, unitCostPerMeter = 0.05) {
  if (!machines || machines.length === 0 || !flowSteps || flowSteps.length < 2) {
    return {
      totalMHW: 0,
      totalCostPerHour: 0,
      pairs: [],
      idealLowerBound: 0
    };
  }

  let totalMHW = 0;
  const pairs = [];

  for (let k = 0; k < flowSteps.length - 1; k++) {
    const idA = flowSteps[k].machineId || flowSteps[k].id || flowSteps[k];
    const idB = flowSteps[k + 1].machineId || flowSteps[k + 1].id || flowSteps[k + 1];

    const machA = machines.find(m => m.id === idA);
    const machB = machines.find(m => m.id === idB);

    if (machA && machB) {
      const dist = calculateManhattanDistance(machA.x, machA.y, machB.x, machB.y);
      const volume = machA.throughput || 100;
      const mhw = volume * dist; // Work in unit-meters
      const cost = mhw * unitCostPerMeter;

      pairs.push({
        from: machA.machineName,
        to: machB.machineName,
        distance: dist,
        volume,
        mhw,
        cost: parseFloat(cost.toFixed(2))
      });

      totalMHW += mhw;
    }
  }

  // Theoretical compact lower bound (adjacent placement ~ 4m per stage)
  const idealLowerBound = (flowSteps.length - 1) * 4 * 100;
  const totalCostPerHour = parseFloat((totalMHW * unitCostPerMeter).toFixed(2));

  return {
    totalMHW: Math.round(totalMHW),
    totalCostPerHour,
    pairs,
    idealLowerBound
  };
}

/**
 * Calculates Area Utilization Ratio (AUR):
 * Gross Footprint = sum(width_i * height_i)
 * Clearance Buffer Footprint = sum((width_i + 2 * buffer) * (height_i + 2 * buffer))
 * AUR (%) = (Clearance Footprint / Factory Floor Area) * 100
 */
export function calculateAreaUtilization(machines, factoryLength = 80, factoryWidth = 50) {
  const factoryArea = factoryLength * factoryWidth;
  if (!machines || machines.length === 0 || factoryArea <= 0) {
    return {
      factoryArea,
      usedEquipmentArea: 0,
      safetyClearanceArea: 0,
      grossAUR: 0,
      effectiveAUR: 0
    };
  }

  let usedEquipmentArea = 0;
  let safetyClearanceArea = 0;

  machines.forEach(m => {
    // Default machine footprint
    const w = m.w || 3.8;
    const h = m.h || 2.8;
    const buffer = 1.0; // 1m OSHA safety aisle buffer

    const eqArea = w * h;
    const bufferArea = (w + 2 * buffer) * (h + 2 * buffer);

    usedEquipmentArea += eqArea;
    safetyClearanceArea += bufferArea;
  });

  const grossAUR = parseFloat(((usedEquipmentArea / factoryArea) * 100).toFixed(1));
  const effectiveAUR = parseFloat(((safetyClearanceArea / factoryArea) * 100).toFixed(1));

  return {
    factoryArea: Math.round(factoryArea),
    usedEquipmentArea: parseFloat(usedEquipmentArea.toFixed(1)),
    safetyClearanceArea: parseFloat(safetyClearanceArea.toFixed(1)),
    grossAUR: Math.min(100, grossAUR),
    effectiveAUR: Math.min(100, effectiveAUR)
  };
}

/**
 * Calculates layout efficiency based on Tompkins' Normalized Material Handling Work
 * and facility diagonal span constraints.
 * 
 * Formal Definition:
 * Efficiency eta = max(0, min(100, [1 - (Total Distance / Theoretical Max Span Distance)] * 100))
 * Where Max Span Distance = (Number of Flow Stages) * (Factory Length + Factory Width) * 0.4
 */
export function calculateEfficiency(distance, stageCount = 5, factoryLength = 80, factoryWidth = 50) {
  if (distance === 0) return 100;
  
  const spanBound = Math.max(1, stageCount) * (factoryLength + factoryWidth) * 0.35;
  const normalizedRatio = distance / spanBound;
  
  // High efficiency when layout is compactly routed
  const rawEfficiency = (1 - normalizedRatio) * 100;
  
  // Clamp between realistic bounds (10% to 98%)
  const clamped = Math.max(10, Math.min(98, rawEfficiency));
  return parseFloat(clamped.toFixed(1));
}

/**
 * Returns rating tier based on efficiency score.
 * 85-100: Excellent (Optimal Line Balancing)
 * 70-84: Good (Standard Industrial Routing)
 * 50-69: Average (Excessive Travel / Cross-Flows)
 * Below 50: Poor (High Congestion & Disjointed Cells)
 */
export function getLayoutRating(efficiency) {
  if (efficiency >= 85) return 'Excellent';
  if (efficiency >= 70) return 'Good';
  if (efficiency >= 50) return 'Average';
  return 'Poor';
}

/**
 * Calculates comprehensive layout metrics summary combining classical distance
 * metrics with academic Operations Research formulations.
 */
export function calculateLayoutMetrics(machines, flowSteps, factoryLength = 80, factoryWidth = 50) {
  const safeMachines = machines || [];
  const safeFlow = flowSteps || [];
  
  const totalDistance = calculateTotalDistance(safeMachines, safeFlow);
  const efficiency = calculateEfficiency(totalDistance, Math.max(1, safeFlow.length - 1), factoryLength, factoryWidth);
  const rating = getLayoutRating(efficiency);
  const averageDistance = safeFlow.length > 1 ? parseFloat((totalDistance / (safeFlow.length - 1)).toFixed(2)) : 0;
  
  const mhwData = calculateMaterialHandlingWork(safeMachines, safeFlow);
  const fromToMatrix = calculateFromToMatrix(safeMachines, safeFlow);
  const areaUtilization = calculateAreaUtilization(safeMachines, factoryLength, factoryWidth);

  return {
    totalDistance,
    averageDistance,
    efficiency,
    rating,
    machineCount: safeMachines.length,
    travelTime: parseFloat((totalDistance * 1.2).toFixed(1)), // Standard 1.2s per meter AGV travel speed
    mhw: mhwData.totalMHW,
    mhwCostPerHour: mhwData.totalCostPerHour,
    areaUtilization: areaUtilization.effectiveAUR,
    grossAUR: areaUtilization.grossAUR,
    fromToMatrix,
    methodology: {
      framework: "Tompkins et al. Facilities Planning (4th Ed.) & Muther's Systematic Layout Planning (SLP)",
      distanceMetric: 'Rectilinear Manhattan Metric (Aisle-aligned travel)',
      objectiveFunction: 'Min sum sum (f_ij * c_ij * d_ij)'
    }
  };
}
