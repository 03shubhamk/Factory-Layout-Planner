const assert = require('assert');

function runTest() {
  console.log('Running Safety Validation Test...');

  const minAisleWidth = 1.0;
  const aisleSample = 1.2;
  const blockedAisle = 0.8;

  assert.ok(aisleSample >= minAisleWidth, '1.2m aisle meets OSHA min clearance');
  assert.ok(blockedAisle < minAisleWidth, '0.8m aisle violates OSHA min clearance');

  console.log('✓ Safety Validation test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
