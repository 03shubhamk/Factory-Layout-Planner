const assert = require('assert');

function runTest() {
  console.log('Running Sanitizer Test...');

  const dirtyName = 'CNC Machine <script>alert(1)</script> #4!';
  const clean = dirtyName.replace(/[^a-zA-Z0-9 _\-#().]/g, '');

  assert.strictEqual(clean.includes('<'), false, 'Sanitized name must strip HTML brackets');
  assert.strictEqual(clean.includes('script'), true, 'Sanitized name preserves alphanumeric text');

  console.log('✓ Sanitizer test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
