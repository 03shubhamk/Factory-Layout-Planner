/**
 * Layout & Report Export Utility Functions
 */

export function exportLayoutToJson(factory, machines, flow, reports) {
  const exportPayload = {
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    factory: {
      id: factory.id,
      name: factory.name,
      length: factory.length,
      width: factory.width,
      departmentCount: factory.departmentCount,
      description: factory.description
    },
    machines: machines || [],
    productionFlow: flow || [],
    latestReport: reports && reports[0] ? reports[0] : null
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${factory.name.toLowerCase().replace(/\s+/g, '-')}-layout.json`;
  a.click();
  URL.revokeObjectURL(url);
}
