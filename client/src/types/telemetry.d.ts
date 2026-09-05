/**
 * Factory Layout Planner - Real-Time Telemetry & IoT Types
 */

export type MachineHealthStatus = 'optimal' | 'warning' | 'critical' | 'offline' | 'maintenance';

export interface WaveformSample {
  time: string;
  vibration: number;
  temperature: number;
  current: number;
  pressure?: number;
  rpm?: number;
}

export interface AnomalyEvent {
  id: string;
  machineId: string;
  machineName: string;
  metric: 'vibration' | 'temperature' | 'current' | 'pressure';
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  recommendation: string;
}

export interface MachineTelemetryState {
  machineId: string;
  machineName: string;
  status: MachineHealthStatus;
  vibration: number; // mm/s RMS
  temperature: number; // °C
  current: number; // Amperes
  powerFactor: number;
  throughput: number; // units/hr
  healthScore: number; // 0 - 100
  history: WaveformSample[];
  faultInjected?: string | null;
  lastUpdated: string;
}

export interface TelemetryFleetSummary {
  totalMachines: number;
  activeNodes: number;
  anomalyCount: number;
  averageHealthScore: number;
  totalPowerDrawKw: number;
  fleetOeePercentage: number;
}
