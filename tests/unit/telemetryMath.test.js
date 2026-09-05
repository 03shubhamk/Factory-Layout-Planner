const assert = require('assert');

function runTest() {
  console.log('Running Telemetry Math Test...');

  // Health Score Calculation Test
  function calcHealth(vibration, temperature, current) {
    let score = 100;
    if (vibration > 4.5) score -= 30;
    if (temperature > 75) score -= 25;
    if (current > 35) score -= 20;
    return Math.max(0, score);
  }

  assert.strictEqual(calcHealth(1.2, 45, 18), 100, 'Normal parameters yield 100 score');
  assert.strictEqual(calcHealth(5.0, 80, 40), 25, 'High fault parameters yield 25 score');

  console.log('✓ Telemetry Math test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
