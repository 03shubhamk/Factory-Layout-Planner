/**
 * Factory Layout Planner - Simulation Engine Type Definitions
 */

export interface SimulationConfig {
  durationMinutes: number;
  batchSize: number;
  randomVariability: number; // standard deviation factor (0.0 - 0.5)
  agvFleetSize?: number;
  agvSpeedMps?: number;
  warmupTimeMinutes?: number;
}

export interface SimulationStepResult {
  step: number;
  simulatedTimeMinutes: number;
  wipCount: number; // Work In Progress
  completedParts: number;
  activeBottleneck?: string;
  machineStates: Record<string, {
    state: 'working' | 'blocked' | 'starved' | 'failed' | 'idle';
    bufferIn: number;
    bufferOut: number;
    utilization: number;
  }>;
}

export interface SimulationSummary {
  totalDurationHours: number;
  totalProducedUnits: number;
  leadTimeAvgMinutes: number;
  averageWip: number;
  throughputPerHour: number;
  bottlenecks: string[];
}
