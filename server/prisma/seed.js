import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.report.deleteMany({});
  await prisma.productionFlow.deleteMany({});
  await prisma.machine.deleteMany({});
  await prisma.factory.deleteMany({});

  console.log('Seeding initial factory layout...');

  // Create sample factory: Industrial Alpha
  const factory1 = await prisma.factory.create({
    data: {
      name: 'Industrial Alpha',
      length: 50,
      width: 30,
      departmentCount: 4,
      description: 'Core manufacturing division for hydraulic assembly and thermal sealing.',
    }
  });

  // Add machines to Industrial Alpha
  const m1 = await prisma.machine.create({
    data: {
      factoryId: factory1.id,
      machineName: 'Hydraulic Press A4',
      machineType: 'Processing',
      x: 12.5,
      y: 8.0,
      orientation: 90,
      status: 'Running',
      throughput: 145,
      health: 'Optimal',
      load: 78
    }
  });

  const m2 = await prisma.machine.create({
    data: {
      factoryId: factory1.id,
      machineName: 'Assembly Arm V2',
      machineType: 'Assembly',
      x: 25.0,
      y: 12.0,
      orientation: 0,
      status: 'Idle',
      throughput: 110,
      health: 'Optimal',
      load: 64
    }
  });

  const m3 = await prisma.machine.create({
    data: {
      factoryId: factory1.id,
      machineName: 'Thermal Sealer G',
      machineType: 'Packaging',
      x: 35.0,
      y: 18.0,
      orientation: 270,
      status: 'Running',
      throughput: 95,
      health: 'Maintenance Required',
      load: 91
    }
  });

  // Create production flow for Industrial Alpha
  await prisma.productionFlow.create({
    data: {
      factoryId: factory1.id,
      step: 1,
      machineId: m1.id
    }
  });

  await prisma.productionFlow.create({
    data: {
      factoryId: factory1.id,
      step: 2,
      machineId: m2.id
    }
  });

  await prisma.productionFlow.create({
    data: {
      factoryId: factory1.id,
      step: 3,
      machineId: m3.id
    }
  });

  // Calculate Manhattan Distance for Industrial Alpha
  // M1 to M2: |25.0 - 12.5| + |12.0 - 8.0| = 12.5 + 4.0 = 16.5m
  // M2 to M3: |35.0 - 25.0| + |18.0 - 12.0| = 10.0 + 6.0 = 16.0m
  // Total Distance = 32.5m
  // Efficiency = 100 - (32.5 * 0.5) = 100 - 16.25 = 83.75% (~84%)
  const distance = 32.5;
  const efficiency = 83.75;
  const rating = 'Good';

  const suggestions = [
    {
      title: 'Relocate Assembly Arm V2',
      description: 'Assembly Arm V2 is currently 16.5m from Hydraulic Press A4. Moving it 5 meters closer will reduce material travel lag.',
      estimatedSaving: 5,
      priority: 'High',
      tag: 'HIGH IMPACT'
    },
    {
      title: 'Thermal Sealer Optimization',
      description: 'Thermal Sealer G is near maintenance threshold (91% load). Recalibrating its feed speed can stabilize throughput.',
      estimatedSaving: 2,
      priority: 'Medium',
      tag: 'MAINTENANCE'
    }
  ];

  await prisma.report.create({
    data: {
      factoryId: factory1.id,
      distance,
      efficiency,
      rating,
      suggestions: JSON.stringify(suggestions)
    }
  });

  // Create another factory: Assembly Line 04 (unplaced layout)
  const factory2 = await prisma.factory.create({
    data: {
      name: 'Assembly Line 04',
      length: 100,
      width: 60,
      departmentCount: 6,
      description: 'North quadrant logistics and sub-assembly line.',
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
