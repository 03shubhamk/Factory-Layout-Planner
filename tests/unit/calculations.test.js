const assert = require('assert');

function runTest() {
  console.log('Running Calculations Test...');

  // 1. Classical OEE formula validation: OEE = Availability * Performance * Quality
  const availability = 0.90;
  const performance = 0.95;
  const quality = 0.98;
  const oee = availability * performance * quality;
  assert.ok(Math.abs(oee - 0.8379) < 0.0001, 'OEE calculation must match expected product');

  // 2. Throughput validation
  const cycleTimeSeconds = 45;
  const theoreticalMaxPerHour = 3600 / cycleTimeSeconds;
  assert.strictEqual(theoreticalMaxPerHour, 80, 'Theoretical max throughput should be 80 units/hr');

  // 3. Tompkins Facilities Planning: Rectilinear Manhattan Distance: d = |x2 - x1| + |y2 - y1|
  const x1 = 6, y1 = 8;
  const x2 = 16, y2 = 24;
  const manhattanDistance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  assert.strictEqual(manhattanDistance, 26, 'Manhattan distance between (6,8) and (16,24) must equal 26 meters');

  // 4. Material Handling Work (MHW) Formulation: MHW = sum sum (f_ij * c_ij * d_ij)
  const flowVolume_fij = 400; // e.g. 400 L/min or units/hr
  const unitCost_cij = 0.05; // $0.05 per unit-meter
  const distance_dij = 26; // meters
  const mhw = flowVolume_fij * distance_dij;
  const handlingCost = mhw * unitCost_cij;
  assert.strictEqual(mhw, 10400, 'Material Handling Work must equal 10,400 unit-meters');
  assert.strictEqual(handlingCost, 520, 'Handling cost must equal $520');

  // 5. Area Utilization Ratio (AUR): AUR = (Gross Footprint + Safety Clearance) / Facility Area
  const factoryLength = 75;
  const factoryWidth = 45;
  const factoryArea = factoryLength * factoryWidth; // 3375 m2
  const machineW = 5.0;
  const machineH = 3.5;
  const buffer = 1.0;
  const clearanceArea = (machineW + 2 * buffer) * (machineH + 2 * buffer); // 7.0 * 5.5 = 38.5 m2
  const singleMachineAUR = (clearanceArea / factoryArea) * 100;
  assert.ok(Math.abs(singleMachineAUR - 1.1407) < 0.01, 'AUR calculation must match expected footprint ratio');

  console.log('✓ Calculations test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
