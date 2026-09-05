/**
 * Factory Layout Planner - Analytics & Optimization Metrics Types
 */

export interface OEEComponents {
  availability: number; // 0.0 - 1.0 (or 0-100%)
  performance: number;  // 0.0 - 1.0 (or 0-100%)
  quality: number;      // 0.0 - 1.0 (or 0-100%)
  overall: number;      // 0.0 - 1.0 (or 0-100%)
}

export interface BottleneckItem {
  machineId: string;
  machineName: string;
  utilization: number;
  queueLength: number;
  cycleTime: number;
  severity: 'critical' | 'moderate' | 'low';
  impactFactor: number;
}

export interface CostBreakdown {
  materialHandlingCost: number;
  energyCostPerHour: number;
  floorSpaceCost: number;
  maintenanceCostAnnual: number;
  totalAnnualOperatingCost: number;
}

export interface FlowOptimizationReport {
  totalTravelDistanceMeters: number;
  crossTrafficIntersections: number;
  flowEfficiencyScore: number; // 0-100
  recommendations: Array<{
    id: string;
    type: 'reposition' | 'buffer' | 'upgrade' | 're-route';
    title: string;
    description: string;
    estimatedSavingsPercent: number;
  }>;
}
