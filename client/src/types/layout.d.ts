/**
 * Factory Layout Planner - Core Layout & Machine Type Definitions
 */

export interface PortCoordinates {
  x: number;
  y: number;
}

export interface MachinePorts {
  in: PortCoordinates;
  out: PortCoordinates;
}

export interface HazardZone {
  radius: number;
  type: 'thermal' | 'radiation' | 'chemical' | 'mechanical';
  description?: string;
}

export interface MachineNode {
  id: string;
  type: string;
  name: string;
  category?: 'machining' | 'assembly' | 'quality' | 'storage' | 'logistics';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  capacity?: number;
  power?: number;
  cycleTime?: number;
  failureRate?: number;
  maintenanceCost?: number;
  hazardZone?: HazardZone;
  status?: 'idle' | 'running' | 'degraded' | 'critical' | 'offline';
  ports?: MachinePorts;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  materialType?: string;
  flowRate?: number;
  transferType?: 'conveyor' | 'agv' | 'forklift' | 'manual' | 'pneumatic';
  costPerUnit?: number;
}

export interface FactoryZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: 'production' | 'storage' | 'safety' | 'aisle' | 'office';
}

export interface FactoryLayout {
  _id?: string;
  name: string;
  description?: string;
  dimensions: {
    width: number;
    length: number;
    height?: number;
    unit: 'm' | 'ft';
  };
  machines: MachineNode[];
  connections: Connection[];
  zones?: FactoryZone[];
  gridSize?: number;
  createdAt?: string;
  updatedAt?: string;
}
