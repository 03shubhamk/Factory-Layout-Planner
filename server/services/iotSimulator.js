import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Internal state of active anomalies per machine
// { [machineId]: { type: 'OVERHEAT' | 'VIBRATION' | 'SPINDLE_JAM' | 'POWER_SURGE', startedAt: Date, severity: 'Warning' | 'Critical' } }
const activeAnomalies = new Map();

// Base sensor state cache per machine to provide smooth, realistic telemetry waveforms
const machineSensorState = new Map();

/**
 * Initializes baseline sensor values based on machine type and configuration
 */
function getBaselineSensorState(machine) {
  const type = machine.machineType || 'Processing';
  
  let baseTemp = 45;
  let baseRpm = 1200;
  let basePower = 12.5; // kW
  let baseVibration = 1.2; // mm/s RMS

  if (type === 'Input') {
    baseTemp = 38;
    baseRpm = 800;
    basePower = 7.5;
    baseVibration = 0.8;
  } else if (type === 'Processing') {
    baseTemp = 58;
    baseRpm = 2400;
    basePower = 22.0;
    baseVibration = 1.8;
  } else if (type === 'Assembly') {
    baseTemp = 42;
    baseRpm = 1100;
    basePower = 9.0;
    baseVibration = 1.0;
  } else if (type === 'Packaging' || type === 'Logistics') {
    baseTemp = 36;
    baseRpm = 950;
    basePower = 6.0;
    baseVibration = 0.9;
  } else if (type === 'Quality') {
    baseTemp = 32;
    baseRpm = 600;
    basePower = 3.5;
    baseVibration = 0.4;
  }

  return {
    temp: baseTemp + (Math.random() * 4 - 2),
    vibration: baseVibration + (Math.random() * 0.4 - 0.2),
    rpm: baseRpm + (Math.random() * 80 - 40),
    powerKw: basePower + (Math.random() * 1.5 - 0.75),
    cycleCount: Math.floor(Math.random() * 500) + 1200,
    oee: Math.min(99, Math.max(70, Math.round(85 + (Math.random() * 10 - 5))))
  };
}

/**
 * Generates the next telemetry tick for a machine, applying anomalies if present
 */
function generateMachineTelemetry(machine) {
  let state = machineSensorState.get(machine.id);
  if (!state) {
    state = getBaselineSensorState(machine);
    machineSensorState.set(machine.id, state);
  }

  const anomaly = activeAnomalies.get(machine.id);
  const isRunning = machine.status === 'Running';
  const isMaintenance = machine.status === 'Maintenance';

  // Smooth Brownian random walk variations
  const tempDrift = (Math.random() - 0.48) * 0.8;
  const vibDrift = (Math.random() - 0.5) * 0.15;
  const rpmDrift = (Math.random() - 0.5) * 15;
  const powerDrift = (Math.random() - 0.5) * 0.4;

  let temp = state.temp + tempDrift;
  let vibration = state.vibration + vibDrift;
  let rpm = isRunning ? (state.rpm + rpmDrift) : (isMaintenance ? 0 : 150);
  let powerKw = isRunning ? (state.powerKw + powerDrift) : 1.2;
  let load = isRunning ? Math.min(100, Math.max(20, machine.load + Math.round((Math.random() - 0.5) * 6))) : 5;
  let healthScore = 98;
  let alert = null;

  // Apply Anomaly Effects
  if (anomaly) {
    if (anomaly.type === 'OVERHEAT') {
      temp = Math.min(98.5, temp + 2.5 + Math.random() * 1.5);
      healthScore = Math.max(30, 100 - (temp - 60) * 2);
      if (temp > 85) {
        alert = {
          level: 'Critical',
          code: 'ERR_THERMAL_RUNAWAY',
          message: `Thermal spike: ${temp.toFixed(1)}°C exceeds critical threshold (85°C)`
        };
      } else if (temp > 75) {
        alert = {
          level: 'Warning',
          code: 'WARN_TEMP_HIGH',
          message: `Elevated operating temperature: ${temp.toFixed(1)}°C`
        };
      }
    } else if (anomaly.type === 'VIBRATION') {
      vibration = Math.min(12.0, vibration + 0.8 + Math.random() * 0.5);
      healthScore = Math.max(25, 100 - vibration * 9);
      if (vibration > 7.0) {
        alert = {
          level: 'Critical',
          code: 'ERR_BEARING_FAILURE',
          message: `Severe mechanical vibration: ${vibration.toFixed(2)} mm/s RMS`
        };
      } else if (vibration > 4.5) {
        alert = {
          level: 'Warning',
          code: 'WARN_VIBRATION_HIGH',
          message: `Bearing harmonics abnormal: ${vibration.toFixed(2)} mm/s RMS`
        };
      }
    } else if (anomaly.type === 'SPINDLE_JAM') {
      rpm = Math.max(0, rpm - 250);
      load = 100;
      powerKw = powerKw * 1.8;
      healthScore = 20;
      alert = {
        level: 'Critical',
        code: 'ERR_SPINDLE_STALL',
        message: 'Spindle stall detected! High stall current draw.'
      };
    } else if (anomaly.type === 'POWER_SURGE') {
      powerKw = powerKw + 15.0;
      healthScore = 45;
      alert = {
        level: 'Warning',
        code: 'WARN_POWER_SPIKE',
        message: `Current surge: ${powerKw.toFixed(1)} kW power consumption`
      };
    }
  } else {
    // Normal bounds clamping
    temp = Math.max(28, Math.min(72, temp));
    vibration = Math.max(0.2, Math.min(3.5, vibration));
    healthScore = Math.min(100, Math.max(85, Math.round(100 - (load > 85 ? 10 : 0) - (temp > 65 ? 8 : 0))));
  }

  // Increment cycle count if running
  const cycleCount = isRunning ? (state.cycleCount + 1) : state.cycleCount;

  // Persist current state in memory
  const updatedState = {
    temp: parseFloat(temp.toFixed(1)),
    vibration: parseFloat(vibration.toFixed(2)),
    rpm: Math.round(Math.max(0, rpm)),
    powerKw: parseFloat(powerKw.toFixed(2)),
    load: Math.round(load),
    cycleCount,
    healthScore: Math.round(healthScore),
    oee: state.oee,
    anomaly: anomaly ? { ...anomaly, alert } : null,
    alert
  };

  machineSensorState.set(machine.id, updatedState);

  return {
    machineId: machine.id,
    machineName: machine.machineName,
    machineType: machine.machineType,
    status: anomaly && alert?.level === 'Critical' ? 'Alarm' : machine.status,
    timestamp: new Date().toISOString(),
    ...updatedState
  };
}

/**
 * Initializes and manages the IoT Socket.io telemetry broadcast loop
 */
export function initIoTService(io) {
  // Track connected factory rooms
  const activeRooms = new Set();

  io.on('connection', (socket) => {
    // Client joins a factory live stream
    socket.on('join_factory_stream', (factoryId) => {
      if (!factoryId) return;
      socket.join(`factory:${factoryId}`);
      activeRooms.add(factoryId);
    });

    // Client leaves a factory stream
    socket.on('leave_factory_stream', (factoryId) => {
      if (!factoryId) return;
      socket.leave(`factory:${factoryId}`);
    });

    // Client triggers anomaly directly via WebSocket
    socket.on('inject_anomaly', ({ factoryId, machineId, type }) => {
      injectAnomaly(factoryId, machineId, type, io);
    });

    // Client resets anomaly directly via WebSocket
    socket.on('reset_anomaly', ({ factoryId, machineId }) => {
      resetAnomaly(factoryId, machineId, io);
    });
  });

  // Telemetry broadcast loop (every 1.5 seconds)
  setInterval(async () => {
    if (activeRooms.size === 0) return;

    for (const factoryId of activeRooms) {
      // Check if room has active connected sockets
      const room = io.sockets.adapter.rooms.get(`factory:${factoryId}`);
      if (!room || room.size === 0) {
        activeRooms.delete(factoryId);
        continue;
      }

      try {
        const factory = await prisma.factory.findUnique({
          where: { id: factoryId },
          include: { machines: true }
        });

        if (!factory || factory.machines.length === 0) continue;

        const telemetryData = factory.machines.map(m => generateMachineTelemetry(m));
        
        // Compute aggregate factory statistics
        const totalPowerKw = telemetryData.reduce((sum, t) => sum + t.powerKw, 0);
        const avgTemp = telemetryData.reduce((sum, t) => sum + t.temp, 0) / telemetryData.length;
        const avgHealth = telemetryData.reduce((sum, t) => sum + t.healthScore, 0) / telemetryData.length;
        const activeAlarms = telemetryData.filter(t => t.alert !== null).map(t => ({
          machineId: t.machineId,
          machineName: t.machineName,
          ...t.alert,
          timestamp: t.timestamp
        }));

        const payload = {
          factoryId,
          timestamp: new Date().toISOString(),
          machines: telemetryData,
          aggregate: {
            totalPowerKw: parseFloat(totalPowerKw.toFixed(1)),
            avgTemp: parseFloat(avgTemp.toFixed(1)),
            fleetHealth: Math.round(avgHealth),
            activeAlarmCount: activeAlarms.length,
            runningCount: telemetryData.filter(t => t.status === 'Running').length,
            totalMachines: telemetryData.length
          },
          alarms: activeAlarms
        };

        io.to(`factory:${factoryId}`).emit('telemetry_update', payload);
      } catch (err) {
        console.error(`Error broadcasting telemetry for factory ${factoryId}:`, err);
      }
    }
  }, 1500);

  console.log('⚡ IoT & OPC-UA Telemetry Streaming Engine initialized');
}

/**
 * Injects a specific anomaly into a machine
 */
export function injectAnomaly(factoryId, machineId, type = 'OVERHEAT', io = null) {
  activeAnomalies.set(machineId, {
    type,
    startedAt: new Date().toISOString(),
    severity: type === 'SPINDLE_JAM' || type === 'OVERHEAT' ? 'Critical' : 'Warning'
  });

  if (io && factoryId) {
    io.to(`factory:${factoryId}`).emit('anomaly_injected', {
      machineId,
      type,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Resets/clears anomalies for a machine
 */
export function resetAnomaly(factoryId, machineId, io = null) {
  activeAnomalies.delete(machineId);
  machineSensorState.delete(machineId);

  if (io && factoryId) {
    io.to(`factory:${factoryId}`).emit('anomaly_reset', {
      machineId,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Ingests external MQTT / OPC-UA telemetry payload
 */
export function ingestExternalTelemetry(factoryId, machineId, rawPayload, io = null) {
  if (machineId && rawPayload) {
    machineSensorState.set(machineId, {
      ...rawPayload,
      timestamp: new Date().toISOString()
    });
  }
}
