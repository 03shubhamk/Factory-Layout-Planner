import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const detailMsg = Object.entries(fieldErrors)
      .map(([k, v]) => `${k}: ${v.join(', ')}`)
      .join('; ');
    return res.status(400).json({
      error: `Validation failed: ${detailMsg}`,
      details: fieldErrors
    });
  }
  req.validated = result.data;
  next();
};

export const factoryCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  length: z.coerce.number().positive('Length must be positive').max(1000),
  width: z.coerce.number().positive('Width must be positive').max(1000),
  departmentCount: z.coerce.number().int().positive('Departments must be at least 1').max(50),
  description: z.string().max(500).nullish().or(z.literal(''))
});

export const factoryUpdateSchema = factoryCreateSchema.partial();

export const machineCreateSchema = z.object({
  machineName: z.string().trim().min(1).max(100),
  machineType: z.string().min(1).max(50),
  x: z.coerce.number().min(0).optional(),
  y: z.coerce.number().min(0).optional(),
  orientation: z.coerce.number().int().min(0).max(360).optional(),
  status: z.enum(['Idle', 'Running', 'Maintenance']).optional(),
  throughput: z.coerce.number().int().positive().optional(),
  health: z.enum(['Optimal', 'Maintenance Required']).optional(),
  load: z.coerce.number().int().min(0).max(100).optional()
});

export const machineUpdateSchema = machineCreateSchema.partial();

export const flowSchema = z.object({
  steps: z.array(z.string().uuid()).min(1)
});

export const reportSchema = z.object({
  distance: z.number().nonnegative(),
  efficiency: z.number().min(0).max(100),
  rating: z.enum(['Excellent', 'Good', 'Average', 'Poor']),
  suggestions: z.union([z.string(), z.array(z.any())])
});

export const anomalySchema = z.object({
  machineId: z.string().uuid(),
  type: z.enum(['OVERHEAT', 'VIBRATION', 'SPINDLE_JAM', 'POWER_SURGE'])
});

export const telemetryPublishSchema = z.object({
  machineId: z.string().uuid(),
  payload: z.object({
    temp: z.number().optional(),
    vibration: z.number().optional(),
    rpm: z.number().optional(),
    powerKw: z.number().optional(),
    load: z.number().optional(),
    healthScore: z.number().optional()
  })
});

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const machineIdParamSchema = z.object({
  id: z.string().uuid(),
  machineId: z.string().uuid()
});