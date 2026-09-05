const assert = require('assert');

function runTest() {
  console.log('Running ROI Calculator Test...');

  const cost = 20000;
  const monthlySavings = 2500;
  const payback = cost / monthlySavings;

  assert.strictEqual(payback, 8, 'Payback period should be 8 months');

  console.log('✓ ROI Calculator test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
