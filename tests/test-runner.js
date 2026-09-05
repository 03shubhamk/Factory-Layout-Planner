/**
 * Standalone Zero-Dependency Test Suite Runner
 */
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  Factory Layout Planner - Automated Test Runner    ');
console.log('====================================================');

const testDir = path.join(__dirname, 'unit');
let passed = 0;
let failed = 0;

if (fs.existsSync(testDir)) {
  const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

  for (const file of files) {
    try {
      const run = require(path.join(testDir, file));
      if (typeof run === 'function') {
        run();
        passed++;
      }
    } catch (err) {
      console.error(`❌ Failed test in ${file}:`, err.message);
      failed++;
    }
  }
}

console.log('----------------------------------------------------');
console.log(`Test Results: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
