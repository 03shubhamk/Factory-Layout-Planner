/**
 * Orthogonal (Manhattan) Flow Path Generator with Rounded Fillet Elbows
 * Generates an SVG path string `d` that models real industrial conveyor tracks.
 */
export function getOrthogonalPath(x1, y1, x2, y2, desiredRadius = 2.5) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // If nearly aligned vertically or horizontally, draw direct straight line
  if (Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5) {
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  const signX = dx > 0 ? 1 : -1;
  const signY = dy > 0 ? 1 : -1;

  // Midpoint X
  const xm = x1 + dx / 2;

  // Radius clamped to half available span
  const r = Math.min(desiredRadius, Math.abs(dx) / 2, Math.abs(dy) / 2);

  // Points along the fillet arc
  const p1x = xm - signX * r;
  const p1y = y1;
  const p2x = xm;
  const p2y = y1 + signY * r;

  const p3x = xm;
  const p3y = y2 - signY * r;
  const p4x = xm + signX * r;
  const p4y = y2;

  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `L ${p1x.toFixed(2)} ${p1y.toFixed(2)}`,
    `Q ${xm.toFixed(2)} ${y1.toFixed(2)}, ${p2x.toFixed(2)} ${p2y.toFixed(2)}`,
    `L ${p3x.toFixed(2)} ${p3y.toFixed(2)}`,
    `Q ${xm.toFixed(2)} ${y2.toFixed(2)}, ${p4x.toFixed(2)} ${p4y.toFixed(2)}`,
    `L ${x2.toFixed(2)} ${y2.toFixed(2)}`
  ].join(' ');
}

