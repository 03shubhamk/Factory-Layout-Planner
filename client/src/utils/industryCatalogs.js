/**
 * Industry-Specific Machinery & Equipment Catalogs
 * 
 * Provides authentic, domain-engineered machinery specifications,
 * physical footprints (in meters), throughput capacities, and operational
 * classifications across four distinct industrial manufacturing verticals:
 * 1. Industrial Water Purification & Automated Bottling Plant
 * 2. Precision Automotive Powertrain & Chassis Assembly
 * 3. High-Density Electronics Surface Mount Technology (SMT)
 * 4. cGMP Pharmaceutical Cleanroom & Oral Solid Dose Manufacturing
 * 
 * References:
 * - Tompkins, White, Bozer, Tanchoco: "Facilities Planning", 4th Ed.
 * - Muther, R.: "Systematic Layout Planning (SLP)", Industrial Press.
 */

export const INDUSTRY_CATALOGS = {
  water_purification: {
    id: 'water_purification',
    name: 'Water Purification & Bottling',
    icon: '💧',
    badge: 'Beverage & Utility cGMP',
    description: 'Industrial reverse osmosis, multi-barrier filtration, sterile cleanroom filling, and automated packaging line for drinking & process water.',
    standardDimensions: { length: 75, width: 45, departmentCount: 5 },
    categories: ['Raw Pre-Treatment', 'Purification Skid', 'Filling & Capping', 'Packaging & Warehousing'],
    machinery: [
      {
        id: 'wp_raw_tank',
        name: 'Raw Water Intake & Equalization Tank',
        type: 'Input',
        schematicType: 'water_tank',
        category: 'Raw Pre-Treatment',
        w: 5.0,
        h: 3.5,
        defaultThroughput: 500, // m3/hr or equivalent
        bufferDistance: 1.5,
        flowUnit: 'L/min',
        description: 'Atmospheric 316L buffer vessel with dual coarse straining pumps for raw feed stabilization.'
      },
      {
        id: 'wp_flocculator',
        name: 'Coagulation & Flocculation Clarifier',
        type: 'Processing',
        schematicType: 'water_filter',
        category: 'Raw Pre-Treatment',
        w: 4.4,
        h: 3.2,
        defaultThroughput: 450,
        bufferDistance: 1.5,
        flowUnit: 'L/min',
        description: 'Chemical dosing manifold and lamella clarifier for suspended solid precipitation.'
      },
      {
        id: 'wp_media_filter',
        name: 'Multi-Media Sand & Carbon Filter Bed',
        type: 'Processing',
        schematicType: 'water_filter',
        category: 'Raw Pre-Treatment',
        w: 4.2,
        h: 2.8,
        defaultThroughput: 420,
        bufferDistance: 1.2,
        flowUnit: 'L/min',
        description: 'Pressurized dual-vessel anthracite, silica sand, and activated carbon bed for VOC & turbidity removal.'
      },
      {
        id: 'wp_ro_skid',
        name: 'Industrial 4-Stage Reverse Osmosis Skid',
        type: 'Processing',
        schematicType: 'water_ro',
        category: 'Purification Skid',
        w: 5.4,
        h: 2.8,
        defaultThroughput: 380,
        bufferDistance: 1.5,
        flowUnit: 'L/min',
        description: 'Multi-tube spiral-wound thin-film composite (TFC) membrane rack with high-pressure Grundfos booster.'
      },
      {
        id: 'wp_uv_ozone',
        name: 'Ozone Contact & UV Sterilization Skid',
        type: 'Processing',
        schematicType: 'water_filter',
        category: 'Purification Skid',
        w: 3.6,
        h: 2.4,
        defaultThroughput: 380,
        bufferDistance: 1.2,
        flowUnit: 'L/min',
        description: 'Closed-loop 254nm ultraviolet reactor with venture ozone injection column for micro-pathogen destruction.'
      },
      {
        id: 'wp_pure_reservoir',
        name: 'Pure Water Polishing Reservoir (316L)',
        type: 'Storage',
        schematicType: 'water_tank',
        category: 'Purification Skid',
        w: 4.6,
        h: 3.6,
        defaultThroughput: 400,
        bufferDistance: 1.5,
        flowUnit: 'L/min',
        description: 'Pharmaceutical-grade sanitary buffer tank with HEPA vent filtration and continuous spray-ball CIP.'
      },
      {
        id: 'wp_blow_molder',
        name: 'Rotary PET Bottle Blow Molder',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Filling & Capping',
        w: 4.8,
        h: 3.0,
        defaultThroughput: 320, // bottles/min
        bufferDistance: 1.5,
        flowUnit: 'BPM',
        description: 'High-speed preform reheating oven and 16-cavity stretch blow molding wheel for PET containers.'
      },
      {
        id: 'wp_filler_monoblock',
        name: 'Rotary Rinser-Filler-Capper Monoblock',
        type: 'Assembly',
        schematicType: 'water_filler',
        category: 'Filling & Capping',
        w: 5.6,
        h: 3.2,
        defaultThroughput: 300,
        bufferDistance: 2.0,
        flowUnit: 'BPM',
        description: 'ISO-5 HEPA laminar hood with 32-head isobaric filling carousel and magnetic torque capping heads.'
      },
      {
        id: 'wp_laser_inspection',
        name: 'Laser Date Coder & Optical Cap Inspector',
        type: 'Quality',
        schematicType: 'Quality',
        category: 'Packaging & Warehousing',
        w: 3.2,
        h: 2.2,
        defaultThroughput: 300,
        bufferDistance: 1.0,
        flowUnit: 'BPM',
        description: 'CO2 laser lot date coder with 360-degree high-speed camera for cap seal integrity verification.'
      },
      {
        id: 'wp_labeler',
        name: 'Continuous Shrink Sleeve Labeler',
        type: 'Processing',
        schematicType: 'Logistics',
        category: 'Packaging & Warehousing',
        w: 3.8,
        h: 2.4,
        defaultThroughput: 280,
        bufferDistance: 1.2,
        flowUnit: 'BPM',
        description: 'Rotary mandrel sleeve applicator with dual-zone steam shrinking tunnel.'
      },
      {
        id: 'wp_case_packer',
        name: 'Case Packer & Poly Shrink Bundler',
        type: 'Logistics',
        schematicType: 'Logistics',
        category: 'Packaging & Warehousing',
        w: 4.6,
        h: 2.8,
        defaultThroughput: 260,
        bufferDistance: 1.5,
        flowUnit: 'Packs/min',
        description: 'Multipack collation lane with heat-shrink wrapping tunnel for 24-pack corrugated trays.'
      },
      {
        id: 'wp_palletizer',
        name: 'Robotic High-Speed Palletizer',
        type: 'Logistics',
        schematicType: 'Assembly',
        category: 'Packaging & Warehousing',
        w: 4.8,
        h: 3.4,
        defaultThroughput: 240,
        bufferDistance: 2.0,
        flowUnit: 'Pallets/hr',
        description: '4-axis articulated robotic arm with dual-station automatic pallet dispenser and orbital stretch wrapper.'
      },
      {
        id: 'wp_dispatch_bay',
        name: 'Finished Goods Dispatch Dock',
        type: 'Storage',
        schematicType: 'Storage',
        category: 'Packaging & Warehousing',
        w: 6.0,
        h: 4.0,
        defaultThroughput: 200,
        bufferDistance: 2.0,
        flowUnit: 'Pallets/hr',
        description: 'Dock leveler bay for automated guided vehicle (AGV) loading into refrigerated transport fleets.'
      }
    ]
  },

  automotive: {
    id: 'automotive',
    name: 'Automotive Manufacturing',
    icon: '🚗',
    badge: 'Heavy Mechanical OEM',
    description: 'High-throughput chassis stamping, automated robotic welding, cathodic electro-paint, and assembly integration.',
    standardDimensions: { length: 80, width: 45, departmentCount: 5 },
    categories: ['Stamping & Fabrication', 'Robotic Assembly', 'Surface Coating', 'End-of-Line QA'],
    machinery: [
      {
        id: 'auto_stamping',
        name: 'Hydraulic Sheet Stamping Press',
        type: 'Input',
        schematicType: 'Input',
        category: 'Stamping & Fabrication',
        w: 5.2,
        h: 3.8,
        defaultThroughput: 180,
        bufferDistance: 2.0,
        flowUnit: 'Parts/hr',
        description: '2000-ton progressive die hydraulic press for structural body panels and floor pans.'
      },
      {
        id: 'auto_cnc_mill',
        name: '5-Axis Heavy CNC Machining Center',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Stamping & Fabrication',
        w: 4.5,
        h: 3.2,
        defaultThroughput: 150,
        bufferDistance: 1.5,
        flowUnit: 'Parts/hr',
        description: 'Rigid cast-iron bed with twin rotary pallets for engine block and cylinder head machining.'
      },
      {
        id: 'auto_welding_cell',
        name: '6-Axis Dual-Arm Spot Welding Cell',
        type: 'Assembly',
        schematicType: 'Assembly',
        category: 'Robotic Assembly',
        w: 4.4,
        h: 3.6,
        defaultThroughput: 160,
        bufferDistance: 2.0,
        flowUnit: 'Parts/hr',
        description: 'Dual Fanuc robotic arms equipped with pneumatic servo welding guns and laser seam tracking.'
      },
      {
        id: 'auto_ecoat_booth',
        name: 'Automated E-Coat & Primer Dip Booth',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Surface Coating',
        w: 5.5,
        h: 3.5,
        defaultThroughput: 140,
        bufferDistance: 2.0,
        flowUnit: 'Bodies/hr',
        description: 'Multi-tank cathodic electro-deposition immersion system with flash-off and curing oven.'
      },
      {
        id: 'auto_powertrain_marriage',
        name: 'Chassis & Powertrain Marriage Station',
        type: 'Assembly',
        schematicType: 'Assembly',
        category: 'Robotic Assembly',
        w: 5.0,
        h: 3.8,
        defaultThroughput: 150,
        bufferDistance: 2.0,
        flowUnit: 'Units/hr',
        description: 'Underbody hydraulic lift station synchronizing engine, transmission, and subframe into the monocoque.'
      },
      {
        id: 'auto_cmm_scanner',
        name: 'Bridge Laser CMM Geometry Scanner',
        type: 'Quality',
        schematicType: 'Quality',
        category: 'End-of-Line QA',
        w: 4.0,
        h: 3.0,
        defaultThroughput: 130,
        bufferDistance: 1.5,
        flowUnit: 'Units/hr',
        description: 'Precision granite datum bridge with optical laser triangulation verifying chassis dimensional tolerance.'
      },
      {
        id: 'auto_dyno_tester',
        name: 'End-of-Line Roller Dyno & Brake Bench',
        type: 'Quality',
        schematicType: 'Quality',
        category: 'End-of-Line QA',
        w: 5.0,
        h: 3.2,
        defaultThroughput: 130,
        bufferDistance: 2.0,
        flowUnit: 'Vehicles/hr',
        description: 'High-inertia rolling road test bench verifying ABS braking, ECU calibration, and emissions compliance.'
      },
      {
        id: 'auto_dispatch_dock',
        name: 'Final Transport Logistics Bay',
        type: 'Storage',
        schematicType: 'Storage',
        category: 'End-of-Line QA',
        w: 5.5,
        h: 3.5,
        defaultThroughput: 120,
        bufferDistance: 2.0,
        flowUnit: 'Vehicles/hr',
        description: 'Multi-carrier transport loading ramp with automated RFID yard management tracking.'
      }
    ]
  },

  electronics: {
    id: 'electronics',
    name: 'Electronics & SMT Assembly',
    icon: '📱',
    badge: 'Micro-Tech ESD Clean',
    description: 'Surface Mount Technology (SMT) line featuring automated paste printing, dual-gantry pick & place, reflow, and 3D AOI.',
    standardDimensions: { length: 60, width: 35, departmentCount: 4 },
    categories: ['Bare Board Feeder', 'SMT Surface Mount', 'Thermal Reflow', 'Testing & Final Box'],
    machinery: [
      {
        id: 'smt_pcb_loader',
        name: 'Automated Bare PCB Vacuum Loader',
        type: 'Input',
        schematicType: 'Input',
        category: 'Bare Board Feeder',
        w: 3.2,
        h: 2.2,
        defaultThroughput: 250,
        bufferDistance: 1.0,
        flowUnit: 'PCBs/hr',
        description: 'Dual-magazine line loader with anti-static air ionization and barcode PCB indexing.'
      },
      {
        id: 'smt_paste_printer',
        name: 'High-Precision Solder Paste Printer',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'SMT Surface Mount',
        w: 3.6,
        h: 2.6,
        defaultThroughput: 240,
        bufferDistance: 1.0,
        flowUnit: 'PCBs/hr',
        description: 'Automatic vision-guided stencil printer with closed-loop squeegee pressure control.'
      },
      {
        id: 'smt_pick_place',
        name: 'Dual-Gantry High-Speed Pick & Place',
        type: 'Assembly',
        schematicType: 'Assembly',
        category: 'SMT Surface Mount',
        w: 4.2,
        h: 2.8,
        defaultThroughput: 220,
        bufferDistance: 1.2,
        flowUnit: 'PCBs/hr',
        description: 'Twin rotary heads with flight-camera alignment placing 0201 chips and fine-pitch BGAs at 80,000 CPH.'
      },
      {
        id: 'smt_reflow_oven',
        name: '10-Zone Nitrogen Reflow Soldering Oven',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Thermal Reflow',
        w: 5.2,
        h: 2.4,
        defaultThroughput: 210,
        bufferDistance: 1.5,
        flowUnit: 'PCBs/hr',
        description: 'Multi-zone convection thermal profile chamber with < 50 ppm oxygen atmosphere and water cooling.'
      },
      {
        id: 'smt_3d_aoi',
        name: '3D Automated Optical Inspection (AOI)',
        type: 'Quality',
        schematicType: 'Quality',
        category: 'Testing & Final Box',
        w: 3.4,
        h: 2.4,
        defaultThroughput: 230,
        bufferDistance: 1.0,
        flowUnit: 'PCBs/hr',
        description: 'Moiré projection fringe interferometry verifying solder fillet geometry and component co-planarity.'
      },
      {
        id: 'smt_selective_wave',
        name: 'Through-Hole Selective Wave Solder',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Thermal Reflow',
        w: 3.8,
        h: 2.6,
        defaultThroughput: 200,
        bufferDistance: 1.2,
        flowUnit: 'PCBs/hr',
        description: 'Electromagnetic mini-wave solder nozzle with automated flux spray for mixed-technology connectors.'
      },
      {
        id: 'smt_functional_test',
        name: 'In-Circuit & Functional ICT Tester',
        type: 'Quality',
        schematicType: 'Quality',
        category: 'Testing & Final Box',
        w: 3.2,
        h: 2.2,
        defaultThroughput: 220,
        bufferDistance: 1.0,
        flowUnit: 'PCBs/hr',
        description: 'Bed-of-nails pneumatic fixture conducting power-on boundary scan and RF frequency verification.'
      },
      {
        id: 'smt_packaging',
        name: 'ESD Shielding Reel & Box Packager',
        type: 'Logistics',
        schematicType: 'Logistics',
        category: 'Testing & Final Box',
        w: 3.8,
        h: 2.4,
        defaultThroughput: 200,
        bufferDistance: 1.2,
        flowUnit: 'Packs/hr',
        description: 'Moisture barrier bag vacuum sealer with desiccant insertion and automated lot label printing.'
      }
    ]
  },

  pharma: {
    id: 'pharma',
    name: 'cGMP Pharmaceutical Cleanroom',
    icon: '💊',
    badge: 'Grade-B Cleanroom cGMP',
    description: 'Sterile formulation, granulation, high-speed rotary tablet compression, blister packaging, and serialization.',
    standardDimensions: { length: 70, width: 40, departmentCount: 5 },
    categories: ['Dispensing & Granulation', 'Compression & Coating', 'Sterile Blister Packaging', 'Serialization & Dispatch'],
    machinery: [
      {
        id: 'pharma_dispensing',
        name: 'Laminar Airflow API Dispensing Booth',
        type: 'Input',
        schematicType: 'Input',
        category: 'Dispensing & Granulation',
        w: 3.8,
        h: 3.0,
        defaultThroughput: 300,
        bufferDistance: 1.5,
        flowUnit: 'Kg/batch',
        description: 'Down-cross ISO-5 laminar airflow containment booth with dual HEPA filtration for API handling.'
      },
      {
        id: 'pharma_granulator',
        name: 'High-Shear Mixer & Fluid Bed Dryer',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Dispensing & Granulation',
        w: 4.5,
        h: 3.2,
        defaultThroughput: 280,
        bufferDistance: 1.5,
        flowUnit: 'Kg/batch',
        description: 'Explosion-proof bottom-drive impellers with top-spray Wurster coating fluid bed dryer.'
      },
      {
        id: 'pharma_tablet_press',
        name: 'High-Speed Rotary Tablet Press',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Compression & Coating',
        w: 3.8,
        h: 3.0,
        defaultThroughput: 290,
        bufferDistance: 1.5,
        flowUnit: 'Tabs/min',
        description: '45-station double-sided rotary press with pre-compression force monitoring and weight control.'
      },
      {
        id: 'pharma_coating_pan',
        name: 'Perforated Pan Film Tablet Coater',
        type: 'Processing',
        schematicType: 'Processing',
        category: 'Compression & Coating',
        w: 4.2,
        h: 3.2,
        defaultThroughput: 260,
        bufferDistance: 1.5,
        flowUnit: 'Kg/batch',
        description: 'Fully automated aqueous and solvent coating system with multi-gun peristaltic spray manifold.'
      },
      {
        id: 'pharma_blister_machine',
        name: 'Thermoforming Blister Sealer Line',
        type: 'Processing',
        schematicType: 'Logistics',
        category: 'Sterile Blister Packaging',
        w: 5.0,
        h: 2.8,
        defaultThroughput: 280,
        bufferDistance: 1.5,
        flowUnit: 'Blisters/min',
        description: 'Continuous rotary cold-form Alu-Alu / PVC-Alu blister sealing machine with pinhole detection.'
      },
      {
        id: 'pharma_checkweigher',
        name: 'Dynamic Checkweigher & Serialization Hub',
        type: 'Quality',
        schematicType: 'Quality',
        category: 'Serialization & Dispatch',
        w: 3.4,
        h: 2.2,
        defaultThroughput: 260,
        bufferDistance: 1.0,
        flowUnit: 'Packs/min',
        description: 'High-speed strain gauge checkweigher with 2D DataMatrix serialization printing and camera verification.'
      },
      {
        id: 'pharma_cartoner',
        name: 'Continuous Motion Cartoning Machine',
        type: 'Logistics',
        schematicType: 'Logistics',
        category: 'Serialization & Dispatch',
        w: 4.6,
        h: 2.6,
        defaultThroughput: 250,
        bufferDistance: 1.5,
        flowUnit: 'Cartons/min',
        description: 'Automatic leaflet folding, blister insertion, and tamper-evident hot melt glue carton sealer.'
      },
      {
        id: 'pharma_clean_staging',
        name: 'cGMP Clean Staging Airlock & Storage',
        type: 'Storage',
        schematicType: 'Storage',
        category: 'Serialization & Dispatch',
        w: 4.2,
        h: 3.2,
        defaultThroughput: 200,
        bufferDistance: 1.5,
        flowUnit: 'Pallets/hr',
        description: 'Interlocked cascading pressure airlock for sterile palletized batch staging prior to warehousing.'
      }
    ]
  }
};

/**
 * Returns list of all available industry profiles.
 */
export function getAllIndustryCatalogs() {
  return Object.values(INDUSTRY_CATALOGS);
}

/**
 * Helper to match an industry catalog from factory name, preset ID, or description text.
 */
export function detectIndustryCatalog(factory) {
  if (!factory) return INDUSTRY_CATALOGS.water_purification;

  const text = `${factory.name || ''} ${factory.description || ''}`.toLowerCase();

  if (text.includes('water') || text.includes('purif') || text.includes('ro ') || text.includes('bottle') || text.includes('aquafina') || text.includes('bisleri') || text.includes('mineral')) {
    return INDUSTRY_CATALOGS.water_purification;
  }
  if (text.includes('auto') || text.includes('car') || text.includes('vehicle') || text.includes('chassis') || text.includes('motor')) {
    return INDUSTRY_CATALOGS.automotive;
  }
  if (text.includes('smt') || text.includes('electronic') || text.includes('pcb') || text.includes('semiconductor') || text.includes('chip')) {
    return INDUSTRY_CATALOGS.electronics;
  }
  if (text.includes('pharma') || text.includes('drug') || text.includes('medicine') || text.includes('tablet') || text.includes('sterile') || text.includes('cleanroom')) {
    return INDUSTRY_CATALOGS.pharma;
  }

  // Default to Water Purification
  return INDUSTRY_CATALOGS.water_purification;
}

export default INDUSTRY_CATALOGS;

