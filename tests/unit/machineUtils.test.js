const assert = require('assert');

function runTest() {
  console.log('Running Machine Utils Test...');

  const m1 = { id: '1', x: 0, y: 0, width: 4, height: 4 };
  const m2 = { id: '2', x: 2, y: 2, width: 4, height: 4 };
  const m3 = { id: '3', x: 10, y: 10, width: 2, height: 2 };

  function checkOverlap(r1, r2) {
    return !(
      r2.x >= r1.x + r1.width ||
      r2.x + r2.width <= r1.x ||
      r2.y >= r1.y + r1.height ||
      r2.y + r2.height <= r1.y
    );
  }

  assert.strictEqual(checkOverlap(m1, m2), true, 'm1 and m2 must overlap');
  assert.strictEqual(checkOverlap(m1, m3), false, 'm1 and m3 must NOT overlap');

  console.log('✓ Machine Utils test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
