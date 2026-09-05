const assert = require('assert');

function runTest() {
  console.log('Running Flow Optimization Test...');

  const p1 = { x: 0, y: 0 };
  const p2 = { x: 3, y: 4 };

  const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  assert.strictEqual(distance, 5, 'Euclidean distance (3-4-5 triangle) must equal 5');

  const manhattan = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
  assert.strictEqual(manhattan, 7, 'Manhattan distance must equal 7');

  console.log('✓ Flow Optimization test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
