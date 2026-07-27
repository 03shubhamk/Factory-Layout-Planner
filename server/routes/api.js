import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// FACTORIES ENDPOINTS
// ==========================================

// Get all factories
router.get('/factories', async (req, res) => {
  try {
    const factories = await prisma.factory.findMany({
      include: {
        machines: true,
        reports: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(factories);
  } catch (error) {
    console.error('Error fetching factories:', error);
    res.status(500).json({ error: 'Failed to fetch factories' });
  }
});

// Get a single factory detail (including machines and production flow)
router.get('/factories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const factory = await prisma.factory.findUnique({
      where: { id },
      include: {
        machines: true,
        productionFlow: {
          orderBy: {
            step: 'asc'
          },
          include: {
            machine: true
          }
        },
        reports: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!factory) {
      return res.status(404).json({ error: 'Factory not found' });
    }

    res.json(factory);
  } catch (error) {
    console.error('Error fetching factory:', error);
    res.status(500).json({ error: 'Failed to fetch factory' });
  }
});

// Create a new factory
router.post('/factories', async (req, res) => {
  const { name, length, width, departmentCount, description } = req.body;
  
  if (!name || !length || !width || !departmentCount) {
    return res.status(400).json({ error: 'Missing required factory details' });
  }

  try {
    const newFactory = await prisma.factory.create({
      data: {
        name,
        length: parseFloat(length),
        width: parseFloat(width),
        departmentCount: parseInt(departmentCount),
        description: description || ''
      }
    });
    res.status(201).json(newFactory);
  } catch (error) {
    console.error('Error creating factory:', error);
    res.status(500).json({ error: 'Failed to create factory' });
  }
});

// Delete factory
router.delete('/factories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.factory.delete({
      where: { id }
    });
    res.json({ message: 'Factory deleted successfully' });
  } catch (error) {
    console.error('Error deleting factory:', error);
    res.status(500).json({ error: 'Failed to delete factory' });
  }
});


// ==========================================
// MACHINES ENDPOINTS
// ==========================================

// Add a machine to factory
router.post('/factories/:id/machines', async (req, res) => {
  const { id: factoryId } = req.params;
  const { machineName, machineType, x, y, orientation, status, throughput, health, load } = req.body;

  if (!machineName || !machineType) {
    return res.status(400).json({ error: 'Machine name and type are required' });
  }

  try {
    const factoryExists = await prisma.factory.findUnique({
      where: { id: factoryId }
    });

    if (!factoryExists) {
      return res.status(404).json({ error: 'Factory not found' });
    }

    const newMachine = await prisma.machine.create({
      data: {
        factoryId,
        machineName,
        machineType,
        x: parseFloat(x || 0),
        y: parseFloat(y || 0),
        orientation: parseInt(orientation || 0),
        status: status || 'Idle',
        throughput: parseInt(throughput || 100),
        health: health || 'Optimal',
        load: parseInt(load || 50)
      }
    });

    res.status(201).json(newMachine);
  } catch (error) {
    console.error('Error adding machine:', error);
    res.status(500).json({ error: 'Failed to add machine' });
  }
});

// Update a machine (position, orientation, status, etc.)
router.put('/factories/:id/machines/:machineId', async (req, res) => {
  const { machineId } = req.params;
  const { machineName, machineType, x, y, orientation, status, throughput, health, load } = req.body;

  try {
    const updatedMachine = await prisma.machine.update({
      where: { id: machineId },
      data: {
        ...(machineName !== undefined && { machineName }),
        ...(machineType !== undefined && { machineType }),
        ...(x !== undefined && { x: parseFloat(x) }),
        ...(y !== undefined && { y: parseFloat(y) }),
        ...(orientation !== undefined && { orientation: parseInt(orientation) }),
        ...(status !== undefined && { status }),
        ...(throughput !== undefined && { throughput: parseInt(throughput) }),
        ...(health !== undefined && { health }),
        ...(load !== undefined && { load: parseInt(load) })
      }
    });

    res.json(updatedMachine);
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ error: 'Failed to update machine' });
  }
});

// Delete a machine
router.delete('/factories/:id/machines/:machineId', async (req, res) => {
  const { machineId } = req.params;
  try {
    // Delete any production flow steps referencing this machine first (handled by cascade or manual)
    await prisma.productionFlow.deleteMany({
      where: { machineId }
    });

    await prisma.machine.delete({
      where: { id: machineId }
    });

    res.json({ message: 'Machine removed successfully' });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ error: 'Failed to delete machine' });
  }
});


// ==========================================
// PRODUCTION FLOW ENDPOINTS
// ==========================================

// Get flow sequence for a factory
router.get('/factories/:id/flow', async (req, res) => {
  const { id: factoryId } = req.params;
  try {
    const flow = await prisma.productionFlow.findMany({
      where: { factoryId },
      orderBy: { step: 'asc' },
      include: { machine: true }
    });
    res.json(flow);
  } catch (error) {
    console.error('Error fetching flow:', error);
    res.status(500).json({ error: 'Failed to fetch production flow' });
  }
});

// Save flow sequence (replaces existing flow steps)
router.post('/factories/:id/flow', async (req, res) => {
  const { id: factoryId } = req.params;
  const { steps } = req.body; // Array of machine IDs in sequence: ['m-id-1', 'm-id-2', ...]

  if (!Array.isArray(steps)) {
    return res.status(400).json({ error: 'Steps must be an array of machine IDs' });
  }

  try {
    // Start transaction to clear old and create new flow
    await prisma.$transaction(async (tx) => {
      // Delete existing flow
      await tx.productionFlow.deleteMany({
        where: { factoryId }
      });

      // Insert new flow elements
      const dataToCreate = steps.map((machineId, index) => ({
        factoryId,
        machineId,
        step: index + 1
      }));

      if (dataToCreate.length > 0) {
        await tx.productionFlow.createMany({
          data: dataToCreate
        });
      }
    });

    const updatedFlow = await prisma.productionFlow.findMany({
      where: { factoryId },
      orderBy: { step: 'asc' },
      include: { machine: true }
    });

    res.json(updatedFlow);
  } catch (error) {
    console.error('Error updating flow:', error);
    res.status(500).json({ error: 'Failed to save production flow' });
  }
});


// ==========================================
// REPORTS ENDPOINTS
// ==========================================

// Get reports for a factory
router.get('/factories/:id/reports', async (req, res) => {
  const { id: factoryId } = req.params;
  try {
    const reports = await prisma.report.findMany({
      where: { factoryId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Create report
router.post('/factories/:id/reports', async (req, res) => {
  const { id: factoryId } = req.params;
  const { distance, efficiency, rating, suggestions } = req.body;

  try {
    const report = await prisma.report.create({
      data: {
        factoryId,
        distance: parseFloat(distance),
        efficiency: parseFloat(efficiency),
        rating,
        suggestions: typeof suggestions === 'string' ? suggestions : JSON.stringify(suggestions)
      }
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

export default router;
