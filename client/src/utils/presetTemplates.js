export const PRESET_TEMPLATES = [
  {
    id: 'automotive',
    name: 'Automotive Assembly Line',
    icon: '🚗',
    category: 'Automotive',
    description: 'High-throughput chassis assembly, automated stamping, body welding, paint booth, and final quality inspection.',
    defaultDimensions: { length: 80, width: 45, departmentCount: 5 },
    machines: [
      { machineName: 'Sheet Stamping Press', machineType: 'Input', x: 6, y: 6, orientation: 0, status: 'Running', throughput: 180, health: 'Optimal', load: 75 },
      { machineName: 'Robotic Welding Arm', machineType: 'Processing', x: 15, y: 10, orientation: 90, status: 'Running', throughput: 160, health: 'Optimal', load: 82 },
      { machineName: 'Electro-Paint Booth', machineType: 'Processing', x: 24, y: 14, orientation: 0, status: 'Running', throughput: 140, health: 'Optimal', load: 68 },
      { machineName: 'Chassis Fit Station', machineType: 'Assembly', x: 33, y: 18, orientation: 270, status: 'Running', throughput: 150, health: 'Optimal', load: 70 },
      { machineName: 'End-of-Line Audit', machineType: 'Quality', x: 42, y: 22, orientation: 0, status: 'Running', throughput: 130, health: 'Optimal', load: 55 }
    ]
  },
  {
    id: 'battery',
    name: 'EV Battery Gigafactory',
    icon: '⚡',
    category: 'Cleanroom',
    description: 'Precision electrode coating, dry-room cell winding, electrolyte injection, aging chamber, and module assembly.',
    defaultDimensions: { length: 100, width: 50, departmentCount: 6 },
    machines: [
      { machineName: 'Slurry Coater Line', machineType: 'Input', x: 6, y: 6, orientation: 0, status: 'Running', throughput: 220, health: 'Optimal', load: 88 },
      { machineName: 'Precision Cell Winder', machineType: 'Processing', x: 15, y: 10, orientation: 90, status: 'Running', throughput: 200, health: 'Optimal', load: 80 },
      { machineName: 'Electrolyte Injector', machineType: 'Processing', x: 24, y: 14, orientation: 0, status: 'Running', throughput: 190, health: 'Optimal', load: 75 },
      { machineName: 'Thermal Aging Chamber', machineType: 'Storage', x: 33, y: 18, orientation: 270, status: 'Running', throughput: 180, health: 'Optimal', load: 60 },
      { machineName: 'Pack Assembly Station', machineType: 'Assembly', x: 42, y: 22, orientation: 0, status: 'Running', throughput: 160, health: 'Optimal', load: 65 }
    ]
  },
  {
    id: 'smt',
    name: 'Electronics SMT Line',
    icon: '📱',
    category: 'High-Tech',
    description: 'Surface Mount Technology line featuring solder paste printing, high-speed pick & place, reflow soldering oven, and AOI inspection.',
    defaultDimensions: { length: 60, width: 35, departmentCount: 4 },
    machines: [
      { machineName: 'PCB Loader Unit', machineType: 'Input', x: 6, y: 6, orientation: 0, status: 'Running', throughput: 250, health: 'Optimal', load: 70 },
      { machineName: 'Solder Paste Printer', machineType: 'Processing', x: 15, y: 10, orientation: 0, status: 'Running', throughput: 240, health: 'Optimal', load: 75 },
      { machineName: 'Dual-Gantry Pick & Place', machineType: 'Assembly', x: 24, y: 14, orientation: 90, status: 'Running', throughput: 220, health: 'Optimal', load: 85 },
      { machineName: 'Reflow Soldering Oven', machineType: 'Processing', x: 33, y: 18, orientation: 0, status: 'Running', throughput: 210, health: 'Optimal', load: 65 },
      { machineName: '3D AOI Inspection', machineType: 'Quality', x: 42, y: 22, orientation: 270, status: 'Running', throughput: 230, health: 'Optimal', load: 50 }
    ]
  },
  {
    id: 'pharma',
    name: 'Pharma Packaging Line',
    icon: '💊',
    category: 'Pharma',
    description: 'cGMP sterile bottle filling, blister pack seal, cartoning machine, checkweigher, and automated palletizer.',
    defaultDimensions: { length: 70, width: 40, departmentCount: 5 },
    machines: [
      { machineName: 'Sterile Bottle Filler', machineType: 'Input', x: 6, y: 6, orientation: 0, status: 'Running', throughput: 300, health: 'Optimal', load: 90 },
      { machineName: 'Thermoform Blister Sealer', machineType: 'Processing', x: 15, y: 10, orientation: 90, status: 'Running', throughput: 280, health: 'Optimal', load: 82 },
      { machineName: 'Continuous Cartoner', machineType: 'Logistics', x: 24, y: 14, orientation: 0, status: 'Running', throughput: 270, health: 'Optimal', load: 78 },
      { machineName: 'Checkweigher & Laser Coder', machineType: 'Quality', x: 33, y: 18, orientation: 270, status: 'Running', throughput: 260, health: 'Optimal', load: 60 },
      { machineName: 'Robotic Palletizer', machineType: 'Logistics', x: 42, y: 22, orientation: 0, status: 'Running', throughput: 250, health: 'Optimal', load: 50 }
    ]
  }
];

export function getPresetById(presetId) {
  return PRESET_TEMPLATES.find(template => template.id === presetId) || null;
}

export default PRESET_TEMPLATES;
