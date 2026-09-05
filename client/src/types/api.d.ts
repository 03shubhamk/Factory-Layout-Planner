/**
 * Factory Layout Planner - REST API Contract Definitions
 */

import { FactoryLayout } from './layout';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface LayoutListResponse {
  success: boolean;
  count: number;
  layouts: FactoryLayout[];
}

export interface LayoutSavePayload {
  name: string;
  description?: string;
  dimensions: {
    width: number;
    length: number;
    height?: number;
    unit: 'm' | 'ft';
  };
  machines: any[];
  connections: any[];
  zones?: any[];
}
