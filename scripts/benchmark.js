/**
 * Factory Layout Planner - Performance Benchmarking Script
 */

console.log('Running Layout Collision & Optimization Benchmark (10,000 iterations)...');

const machines = Array.from({ length: 50 }, (_, i) => ({
  id: `m-${i}`,
  x: (i * 3) % 40,
  y: (i * 2) % 25,
  width: 2.5,
  height: 2.0
}));

const startTime = process.hrtime.bigint();

let collisions = 0;
for (let iter = 0; iter < 10000; iter++) {
  for (let i = 0; i < machines.length; i++) {
    for (let j = i + 1; j < machines.length; j++) {
      const r1 = machines[i];
      const r2 = machines[j];
      const overlap = !(
        r2.x >= r1.x + r1.width ||
        r2.x + r2.width <= r1.x ||
        r2.y >= r1.y + r1.height ||
        r2.y + r2.height <= r1.y
      );
      if (overlap) collisions++;
    }
  }
}

const endTime = process.hrtime.bigint();
const durationMs = Number(endTime - startTime) / 1e6;

console.log(`Benchmark Completed: ${durationMs.toFixed(2)} ms total (${(durationMs / 10000).toFixed(4)} ms/op)`);
