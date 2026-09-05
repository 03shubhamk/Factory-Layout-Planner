const assert = require('assert');

function runTest() {
  console.log('Running Calculations Test...');

  // Formula validation: OEE = Availability * Performance * Quality
  const availability = 0.90;
  const performance = 0.95;
  const quality = 0.98;
  const oee = availability * performance * quality;

  assert.ok(Math.abs(oee - 0.8379) < 0.0001, 'OEE calculation must match expected product');

  // Throughput validation
  const cycleTimeSeconds = 45;
  const theoreticalMaxPerHour = 3600 / cycleTimeSeconds;
  assert.strictEqual(theoreticalMaxPerHour, 80, 'Theoretical max throughput should be 80 units/hr');

  console.log('✓ Calculations test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
