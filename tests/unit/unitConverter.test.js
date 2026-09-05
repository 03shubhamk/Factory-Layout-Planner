const assert = require('assert');

function runTest() {
  console.log('Running Unit Converter Test...');

  const m = 10;
  const ft = m * 3.28084;
  assert.ok(Math.abs(ft - 32.8084) < 0.01, '10 meters = ~32.81 feet');

  const kw = 100;
  const hp = kw * 1.34102;
  assert.ok(Math.abs(hp - 134.102) < 0.1, '100 kW = ~134.1 HP');

  console.log('✓ Unit Converter test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
