/**
 * AutomationML / XML Factory Layout Exporter
 */

export const XmlFormatter = {
  /**
   * Generates standard XML representation of the factory layout
   * @param {Object} layout
   */
  exportToXml: (layout) => {
    const lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<CAEXFile SchemaVersion="3.0" FileName="FactoryLayout.aml">');
    lines.push('  <InstanceHierarchy Name="FactoryTopology">');
    lines.push(`    <InternalElement Name="${escapeXml(layout.name || 'FactoryFloor')}">`);
    lines.push(`      <Attribute Name="Width" Value="${layout.dimensions?.width || 50}" Unit="m"/>`);
    lines.push(`      <Attribute Name="Length" Value="${layout.dimensions?.length || 30}" Unit="m"/>`);

    // Machines
    lines.push('      <InternalElement Name="Machines">');
    (layout.machines || []).forEach((m) => {
      lines.push(`        <InternalElement ID="${escapeXml(m.id)}" Name="${escapeXml(m.name)}" Type="${escapeXml(m.type)}">`);
      lines.push(`          <Attribute Name="PosX" Value="${m.x}"/>`);
      lines.push(`          <Attribute Name="PosY" Value="${m.y}"/>`);
      lines.push(`          <Attribute Name="Width" Value="${m.width}"/>`);
      lines.push(`          <Attribute Name="Height" Value="${m.height}"/>`);
      lines.push('        </InternalElement>');
    });
    lines.push('      </InternalElement>');

    // Connections
    lines.push('      <InternalElement Name="MaterialFlows">');
    (layout.connections || []).forEach((c) => {
      lines.push(`        <InternalLink ID="${escapeXml(c.id)}" Source="${escapeXml(c.source)}" Target="${escapeXml(c.target)}" FlowRate="${c.flowRate || 10}"/>`);
    });
    lines.push('      </InternalElement>');

    lines.push('    </InternalElement>');
    lines.push('  </InstanceHierarchy>');
    lines.push('</CAEXFile>');

    return lines.join('\n');
  }
};

function escapeXml(unsafe = '') {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case ''': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default XmlFormatter;
