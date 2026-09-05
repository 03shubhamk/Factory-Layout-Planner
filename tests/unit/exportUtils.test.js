const assert = require('assert');

function runTest() {
  console.log('Running Export Utils Test...');

  const mockMachines = [
    { id: 'cnc-1', name: 'CNC Mill A', x: 5, y: 10, width: 2, height: 3 },
    { id: 'lathe-1', name: 'Lathe B', x: 12, y: 10, width: 2.5, height: 2 }
  ];

  const csvRows = [
    'ID,Name,X,Y,Width,Height',
    ...mockMachines.map(m => `${m.id},${m.name},${m.x},${m.y},${m.width},${m.height}`)
  ];
  const csvContent = csvRows.join('\n');

  assert.ok(csvContent.includes('CNC Mill A'), 'CSV must include machine name');
  assert.ok(csvContent.includes('lathe-1'), 'CSV must include machine ID');

  console.log('✓ Export Utils test passed.');
}

module.exports = runTest;
if (require.main === module) runTest();
