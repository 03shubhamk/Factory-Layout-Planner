/**
 * Industrial Preset Templates with Pre-Configured CAD Machine Coordinates
 * 
 * Provides production-ready facility layouts across key industrial domains.
 * The Water Purification preset features a standard 9-workstation sequence
 * following Tompkins et al. facilities planning layout principles.
 */

export const PRESET_TEMPLATES = [
  {
    id: 'water_purification',
    name: 'Industrial Water Purification & Bottling Plant',
    icon: '💧',
    category: 'Beverage & Utility',
    description: 'Turnkey industrial water treatment facility: Raw water intake, multi-media filter, 4-stage RO skid, UV/Ozone sterilization, rotary rinser-filler monoblock, laser coder, sleeve labeler, case bundler, and dispatch dock.',
    defaultDimensions: { length: 75, width: 45, departmentCount: 5 },
    machines: [
      { machineName: 'Raw Water Intake Reservoir', machineType: 'Input', x: 6, y: 8, orientation: 0, status: 'Running', throughput: 500, health: 'Optimal', load: 85 },
      { machineName: 'Multi-Media Sand & Carbon Filter', machineType: 'Processing', x: 16, y: 8, orientation: 0, status: 'Running', throughput: 450, health: 'Optimal', load: 80 },
      { machineName: '4-Stage Industrial RO Skid', machineType: 'Processing', x: 28, y: 8, orientation: 0, status: 'Running', throughput: 400, health: 'Optimal', load: 88 },
      { machineName: 'UV & Ozone Sterilization Unit', machineType: 'Processing', x: 40, y: 8, orientation: 0, status: 'Running', throughput: 380, health: 'Optimal', load: 75 },
      { machineName: 'Pure Water Polishing Tank', machineType: 'Storage', x: 52, y: 8, orientation: 90, status: 'Running', throughput: 400, health: 'Optimal', load: 70 },
      { machineName: 'Rotary Rinser-Filler-Capper Monoblock', machineType: 'Assembly', x: 56, y: 22, orientation: 180, status: 'Running', throughput: 320, health: 'Optimal', load: 92 },
      { machineName: 'Laser Coder & Cap Inspector', machineType: 'Quality', x: 42, y: 24, orientation: 180, status: 'Running', throughput: 300, health: 'Optimal', load: 65 },
      { machineName: 'Continuous Shrink Sleeve Labeler', machineType: 'Processing', x: 30, y: 24, orientation: 180, status: 'Running', throughput: 280, health: 'Optimal', load: 72 },
      { machineName: 'Case Bundler & Palletizer', machineType: 'Logistics', x: 16, y: 24, orientation: 180, status: 'Running', throughput: 260, health: 'Optimal', load: 78 },
      { machineName: 'Finished Water Dispatch Dock', machineType: 'Storage', x: 6, y: 24, orientation: 180, status: 'Running', throughput: 240, health: 'Optimal', load: 60 }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive Powertrain & Assembly Line',
    icon: '🚗',
    category: 'Automotive',
    description: 'High-throughput chassis stamping, automated robotic welding, cathodic electro-paint booth, chassis marriage, and end-of-line dyno inspection.',
    defaultDimensions: { length: 80, width: 45, departmentCount: 5 },
    machines: [
      { machineName: 'Sheet Stamping Press', machineType: 'Input', x: 6, y: 8, orientation: 0, status: 'Running', throughput: 180, health: 'Optimal', load: 75 },
      { machineName: '5-Axis CNC Machining Center', machineType: 'Processing', x: 18, y: 8, orientation: 0, status: 'Running', throughput: 160, health: 'Optimal', load: 82 },
      { machineName: 'Robotic Spot Welding Cell', machineType: 'Assembly', x: 32, y: 10, orientation: 90, status: 'Running', throughput: 160, health: 'Optimal', load: 80 },
      { machineName: 'Electro-Paint Dip Booth', machineType: 'Processing', x: 46, y: 12, orientation: 0, status: 'Running', throughput: 140, health: 'Optimal', load: 68 },
      { machineName: 'Chassis Marriage Station', machineType: 'Assembly', x: 60, y: 18, orientation: 180, status: 'Running', throughput: 150, health: 'Optimal', load: 70 },
      { machineName: 'Laser CMM Geometry Scanner', machineType: 'Quality', x: 46, y: 26, orientation: 180, status: 'Running', throughput: 130, health: 'Optimal', load: 55 },
      { machineName: 'End-of-Line Roller Dyno', machineType: 'Quality', x: 30, y: 26, orientation: 180, status: 'Running', throughput: 130, health: 'Optimal', load: 60 },
      { machineName: 'Vehicle Dispatch Bay', machineType: 'Storage', x: 14, y: 26, orientation: 180, status: 'Running', throughput: 120, health: 'Optimal', load: 50 }
    ]
  },
  {
    id: 'smt',
    name: 'Electronics SMT Production Line',
    icon: '📱',
    category: 'High-Tech',
    description: 'Surface Mount Technology line featuring bare PCB loading, precision solder paste printing, high-speed dual-gantry pick & place, reflow oven, and 3D AOI inspection.',
    defaultDimensions: { length: 60, width: 35, departmentCount: 4 },
    machines: [
      { machineName: 'PCB Vacuum Loader', machineType: 'Input', x: 6, y: 8, orientation: 0, status: 'Running', throughput: 250, health: 'Optimal', load: 70 },
      { machineName: 'Solder Paste Stencil Printer', machineType: 'Processing', x: 16, y: 8, orientation: 0, status: 'Running', throughput: 240, health: 'Optimal', load: 75 },
      { machineName: 'Dual-Gantry Pick & Place', machineType: 'Assembly', x: 28, y: 10, orientation: 90, status: 'Running', throughput: 220, health: 'Optimal', load: 85 },
      { machineName: '10-Zone Reflow Soldering Oven', machineType: 'Processing', x: 42, y: 12, orientation: 0, status: 'Running', throughput: 210, health: 'Optimal', load: 65 },
      { machineName: '3D AOI Optical Inspection', machineType: 'Quality', x: 48, y: 22, orientation: 180, status: 'Running', throughput: 230, health: 'Optimal', load: 50 },
      { machineName: 'Selective Wave Soldering', machineType: 'Processing', x: 34, y: 22, orientation: 180, status: 'Running', throughput: 200, health: 'Optimal', load: 60 },
      { machineName: 'Functional ICT Tester', machineType: 'Quality', x: 20, y: 22, orientation: 180, status: 'Running', throughput: 220, health: 'Optimal', load: 55 },
      { machineName: 'ESD Taping & Boxing Dock', machineType: 'Logistics', x: 8, y: 22, orientation: 180, status: 'Running', throughput: 200, health: 'Optimal', load: 50 }
    ]
  },
  {
    id: 'pharma',
    name: 'cGMP Pharmaceutical Cleanroom',
    icon: '💊',
    category: 'Pharma',
    description: 'cGMP sterile formulation, API dispensing booth, high-shear granulator, rotary tablet press, blister packaging, serialization verifier, and carton bundler.',
    defaultDimensions: { length: 70, width: 40, departmentCount: 5 },
    machines: [
      { machineName: 'Laminar API Dispensing Booth', machineType: 'Input', x: 6, y: 8, orientation: 0, status: 'Running', throughput: 300, health: 'Optimal', load: 90 },
      { machineName: 'High-Shear Mixer & Fluid Bed', machineType: 'Processing', x: 18, y: 8, orientation: 0, status: 'Running', throughput: 280, health: 'Optimal', load: 82 },
      { machineName: 'Rotary Tablet Press', machineType: 'Processing', x: 30, y: 10, orientation: 0, status: 'Running', throughput: 290, health: 'Optimal', load: 85 },
      { machineName: 'Perforated Pan Film Coater', machineType: 'Processing', x: 44, y: 12, orientation: 0, status: 'Running', throughput: 260, health: 'Optimal', load: 78 },
      { machineName: 'Thermoform Blister Machine', machineType: 'Processing', x: 54, y: 22, orientation: 180, status: 'Running', throughput: 280, health: 'Optimal', load: 80 },
      { machineName: 'Checkweigher & Serialization Hub', machineType: 'Quality', x: 40, y: 22, orientation: 180, status: 'Running', throughput: 260, health: 'Optimal', load: 60 },
      { machineName: 'Continuous Motion Cartoner', machineType: 'Logistics', x: 26, y: 22, orientation: 180, status: 'Running', throughput: 250, health: 'Optimal', load: 65 },
      { machineName: 'Clean Staging Airlock Dock', machineType: 'Storage', x: 10, y: 22, orientation: 180, status: 'Running', throughput: 200, health: 'Optimal', load: 50 }
    ]
  }
];

export function getPresetById(presetId) {
  return PRESET_TEMPLATES.find(template => template.id === presetId) || null;
}

export default PRESET_TEMPLATES;
