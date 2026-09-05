/**
 * ISO 22400: Automation systems and integration — Key performance indicators (KPIs) for manufacturing operations management
 */

export const ISO_22400_KPIS = {
  OEE: {
    id: 'KPI-01',
    name: 'Overall Equipment Effectiveness',
    symbol: 'OEE',
    formula: 'Availability * Performance * Quality',
    targetBenchmark: 0.85, // World-Class Benchmark = 85%
    unit: 'ratio'
  },
  AVAILABILITY: {
    id: 'KPI-02',
    name: 'Availability Rate',
    symbol: 'Av',
    formula: 'Operating Time / Planned Production Time',
    unit: 'ratio'
  },
  PERFORMANCE: {
    id: 'KPI-03',
    name: 'Performance Efficiency',
    symbol: 'Pe',
    formula: '(Total Count * Ideal Cycle Time) / Operating Time',
    unit: 'ratio'
  },
  QUALITY: {
    id: 'KPI-04',
    name: 'Quality Rate',
    symbol: 'Qr',
    formula: 'Good Count / Total Count',
    unit: 'ratio'
  },
  ALLOCATION_EFFICIENCY: {
    id: 'KPI-05',
    name: 'Equipment Allocation Efficiency',
    symbol: 'EAE',
    formula: 'Actual Production Time / Total Available Time',
    unit: 'ratio'
  },
  NEEE: {
    id: 'KPI-06',
    name: 'Net Equipment Effectiveness',
    symbol: 'NEE',
    formula: 'Operating Time / Actual Production Time',
    unit: 'ratio'
  },
  UTILIZATION_RATE: {
    id: 'KPI-07',
    name: 'Machine Utilization Rate',
    symbol: 'UR',
    formula: 'Running Time / Total Working Hours',
    unit: 'ratio'
  }
};

export default ISO_22400_KPIS;
