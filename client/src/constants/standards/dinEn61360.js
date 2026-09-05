/**
 * DIN EN 61360 / IEC 61360 Common Data Dictionary (CDD) Equipment Classification
 */

export const EQUIPMENT_CLASSES = {
  SUBTRACTIVE_MACHINING: {
    code: '0173-1#01-AAA001#001',
    category: 'Milling, Turning, Grinding',
    standardClearanceMeters: 1.5,
    thermalHazard: true
  },
  ADDITIVE_MANUFACTURING: {
    code: '0173-1#01-AAA002#001',
    category: '3D Printers, SLS, SLM',
    standardClearanceMeters: 1.2,
    thermalHazard: true
  },
  JOINING_ASSEMBLY: {
    code: '0173-1#01-AAA003#001',
    category: 'Robotic Welding, Screwdriving, Gluing',
    standardClearanceMeters: 2.0,
    thermalHazard: true
  },
  MATERIAL_HANDLING: {
    code: '0173-1#01-AAA004#001',
    category: 'AGVs, Conveyors, Gantry Cranes',
    standardClearanceMeters: 2.5,
    thermalHazard: false
  },
  QUALITY_INSPECTION: {
    code: '0173-1#01-AAA005#001',
    category: 'CMM, Optical 3D Scanners, Vision Rigs',
    standardClearanceMeters: 1.0,
    thermalHazard: false
  }
};

export default EQUIPMENT_CLASSES;
