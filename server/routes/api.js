import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { injectAnomaly, resetAnomaly, ingestExternalTelemetry } from '../services/iotSimulator.js';
import { z } from 'zod';
import { validate, factoryCreateSchema, factoryUpdateSchema, machineCreateSchema, machineUpdateSchema, flowSchema, reportSchema, anomalySchema, telemetryPublishSchema, idParamSchema, machineIdParamSchema } from '../middleware/validation.js';

const router = Router();
const prisma = new PrismaClient();

let ioInstance = null;
export function setSocketIOInstance(io) {
  ioInstance = io;
}

const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid parameters', details: result.error.flatten().fieldErrors });
  }
  next();
};

router.get('/factories', async (req, res) => {
  try {
    const factories = await prisma.factory.findMany({
      include: {
        machines: true,
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(factories);
  } catch (error) {
    console.error('Error fetching factories:', error);
    res.status(500).json({ error: 'Failed to fetch factories' });
  }
});

router.get('/factories/:id', validateParams(idParamSchema), async (req, res) => {
  const { id } = req.params;
  try {
    const factory = await prisma.factory.findUnique({
      where: { id },
      include: {
        machines: true,
        productionFlow: { orderBy: { step: 'asc' }, include: { machine: true } },
        reports: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });
    if (!factory) return res.status(404).json({ error: 'Factory not found' });
    res.json(factory);
  } catch (error) {
    console.error('Error fetching factory:', error);
    res.status(500).json({ error: 'Failed to fetch factory' });
  }
});

router.post('/factories', validate(factoryCreateSchema), async (req, res) => {
  try {
    const newFactory = await prisma.factory.create({ data: req.validated });
    res.status(201).json(newFactory);
  } catch (error) {
    console.error('Error creating factory:', error);
    res.status(500).json({ error: 'Failed to create factory' });
  }
});

router.put('/factories/:id', validateParams(idParamSchema), validate(factoryUpdateSchema), async (req, res) => {
  try {
    const updated = await prisma.factory.update({ where: { id: req.params.id }, data: req.validated });
    res.json(updated);
  } catch (error) {
    console.error('Error updating factory:', error);
    res.status(500).json({ error: 'Failed to update factory' });
  }
});

router.delete('/factories/:id', validateParams(idParamSchema), async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.report.deleteMany({ where: { factoryId: req.params.id } }),
      prisma.productionFlow.deleteMany({ where: { factoryId: req.params.id } }),
      prisma.machine.deleteMany({ where: { factoryId: req.params.id } }),
      prisma.factory.delete({ where: { id: req.params.id } })
    ]);
    res.json({ message: 'Factory deleted successfully' });
  } catch (error) {
    console.error('Error deleting factory:', error);
    res.status(500).json({ error: 'Failed to delete factory' });
  }
});

router.post('/factories/:id/machines', validateParams(idParamSchema), validate(machineCreateSchema), async (req, res) => {
  try {
    const factoryExists = await prisma.factory.findUnique({ where: { id: req.params.id } });
    if (!factoryExists) return res.status(404).json({ error: 'Factory not found' });
    const newMachine = await prisma.machine.create({ data: { factoryId: req.params.id, ...req.validated } });
    res.status(201).json(newMachine);
  } catch (error) {
    console.error('Error adding machine:', error);
    res.status(500).json({ error: 'Failed to add machine' });
  }
});

router.put('/factories/:id/machines/:machineId', validateParams(machineIdParamSchema), validate(machineUpdateSchema), async (req, res) => {
  try {
    const updatedMachine = await prisma.machine.update({ where: { id: req.params.machineId }, data: req.validated });
    res.json(updatedMachine);
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ error: 'Failed to update machine' });
  }
});

router.delete('/factories/:id/machines/:machineId', validateParams(machineIdParamSchema), async (req, res) => {
  try {
    await prisma.productionFlow.deleteMany({ where: { machineId: req.params.machineId } });
    await prisma.machine.delete({ where: { id: req.params.machineId } });
    res.json({ message: 'Machine removed successfully' });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ error: 'Failed to delete machine' });
  }
});

router.get('/factories/:id/flow', validateParams(idParamSchema), async (req, res) => {
  try {
    const flow = await prisma.productionFlow.findMany({ where: { factoryId: req.params.id }, orderBy: { step: 'asc' }, include: { machine: true } });
    res.json(flow);
  } catch (error) {
    console.error('Error fetching flow:', error);
    res.status(500).json({ error: 'Failed to fetch production flow' });
  }
});

router.post('/factories/:id/flow', validateParams(idParamSchema), validate(flowSchema), async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.productionFlow.deleteMany({ where: { factoryId: req.params.id } });
      const dataToCreate = req.validated.steps.map((machineId, index) => ({ factoryId: req.params.id, machineId, step: index + 1 }));
      if (dataToCreate.length > 0) await tx.productionFlow.createMany({ data: dataToCreate });
    });
    const updatedFlow = await prisma.productionFlow.findMany({ where: { factoryId: req.params.id }, orderBy: { step: 'asc' }, include: { machine: true } });
    res.json(updatedFlow);
  } catch (error) {
    console.error('Error updating flow:', error);
    res.status(500).json({ error: 'Failed to save production flow' });
  }
});

router.get('/factories/:id/reports', validateParams(idParamSchema), async (req, res) => {
  try {
    const reports = await prisma.report.findMany({ where: { factoryId: req.params.id }, orderBy: { createdAt: 'desc' } });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.post('/factories/:id/reports', validateParams(idParamSchema), validate(reportSchema), async (req, res) => {
  try {
    const data = { ...req.validated, suggestions: typeof req.validated.suggestions === 'string' ? req.validated.suggestions : JSON.stringify(req.validated.suggestions) };
    const report = await prisma.report.create({ data: { factoryId: req.params.id, ...data } });
    res.status(201).json(report);
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

router.post('/factories/:id/telemetry/inject-anomaly', validateParams(idParamSchema), validate(anomalySchema), (req, res) => {
  injectAnomaly(req.params.id, req.validated.machineId, req.validated.type, ioInstance);
  res.json({ success: true, message: `Anomaly ${req.validated.type} injected into machine ${req.validated.machineId}` });
});

router.post('/factories/:id/telemetry/reset-anomaly', validateParams(idParamSchema), validate(z.object({ machineId: z.string().uuid() })), (req, res) => {
  resetAnomaly(req.params.id, req.validated.machineId, ioInstance);
  res.json({ success: true, message: `Anomaly reset for machine ${req.validated.machineId}` });
});

router.post('/factories/:id/telemetry/publish', validateParams(idParamSchema), validate(telemetryPublishSchema), (req, res) => {
  ingestExternalTelemetry(req.params.id, req.validated.machineId, req.validated.payload, ioInstance);
  res.json({ success: true, message: 'Telemetry received and queued for broadcast' });
});

export default router;