/**
 * Factory Layout Planner - Socket.io Server & Client Event Schemas
 */

export interface ServerToClientEvents {
  'telemetry-update': (data: {
    machineId: string;
    metrics: {
      vibration: number;
      temperature: number;
      current: number;
      powerFactor: number;
      status: string;
      healthScore: number;
    };
    timestamp: string;
  }) => void;

  'fleet-summary': (summary: {
    totalMachines: number;
    activeNodes: number;
    criticalAlerts: number;
    avgHealthScore: number;
  }) => void;

  'fault-alert': (alert: {
    machineId: string;
    faultType: string;
    severity: string;
    description: string;
    timestamp: string;
  }) => void;
}

export interface ClientToServerEvents {
  'join-layout-telemetry': (layoutId: string) => void;
  'leave-layout-telemetry': (layoutId: string) => void;
  'inject-fault': (payload: { layoutId: string; machineId: string; faultType: string }) => void;
  'clear-fault': (payload: { layoutId: string; machineId: string }) => void;
  'set-simulation-speed': (speedMultiplier: number) => void;
}
