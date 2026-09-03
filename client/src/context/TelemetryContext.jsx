import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getSocket, 
  subscribeToFactoryTelemetry, 
  unsubscribeFromFactoryTelemetry, 
  triggerMachineAnomaly, 
  clearMachineAnomaly 
} from '../services/socket';
import { useFactory } from './FactoryContext';
import { toast } from 'react-toastify';

const TelemetryContext = createContext();

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

export const TelemetryProvider = ({ children }) => {
  const { activeFactory } = useFactory();
  const [isConnected, setIsConnected] = useState(false);
  const [packetCount, setPacketCount] = useState(0);
  const [lastPacketTime, setLastPacketTime] = useState(null);

  // Latest telemetry snapshot keyed by machineId
  const [telemetryByMachine, setTelemetryByMachine] = useState({});

  // Rolling time-series history for charts (max 20 points per machine)
  const [telemetryHistory, setTelemetryHistory] = useState({});

  // Factory-level aggregate KPIs
  const [aggregate, setAggregate] = useState({
    totalPowerKw: 0,
    avgTemp: 0,
    fleetHealth: 100,
    activeAlarmCount: 0,
    runningCount: 0,
    totalMachines: 0
  });

  // Alarms and anomalies log
  const [alarms, setAlarms] = useState([]);
  const [alarmHistory, setAlarmHistory] = useState([]);

  // Socket event subscriptions
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      if (activeFactory?.id) {
        subscribeToFactoryTelemetry(activeFactory.id);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleTelemetryUpdate = (payload) => {
      if (!payload || !payload.machines) return;

      const timestamp = new Date(payload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastPacketTime(timestamp);
      setPacketCount(prev => prev + 1);

      // 1. Update snapshot
      const newSnapshot = {};
      payload.machines.forEach(m => {
        newSnapshot[m.machineId] = m;
      });
      setTelemetryByMachine(newSnapshot);

      // 2. Append to rolling history
      setTelemetryHistory(prevHistory => {
        const nextHistory = { ...prevHistory };
        payload.machines.forEach(m => {
          const current = nextHistory[m.machineId] || [];
          const newPoint = {
            time: timestamp,
            temp: m.temp,
            vibration: m.vibration,
            rpm: m.rpm,
            powerKw: m.powerKw,
            load: m.load,
            healthScore: m.healthScore
          };
          // Keep last 20 data points
          nextHistory[m.machineId] = [...current.slice(-19), newPoint];
        });
        return nextHistory;
      });

      // 3. Update aggregate
      if (payload.aggregate) {
        setAggregate(payload.aggregate);
      }

      // 4. Update alarms
      if (payload.alarms) {
        setAlarms(payload.alarms);

        // Notify on new critical alarms
        payload.alarms.forEach(alarm => {
          if (alarm.level === 'Critical') {
            // Optional: avoid duplicate toasts by tracking last alert ID
          }
        });
      }
    };

    const handleAnomalyInjected = ({ machineId, type }) => {
      toast.warn(`⚡ Anomaly injected on machine: ${type}`, { autoClose: 3000 });
      setAlarmHistory(prev => [
        {
          id: `alarm-${Date.now()}`,
          machineId,
          type,
          timestamp: new Date().toLocaleTimeString(),
          status: 'Active'
        },
        ...prev.slice(0, 15)
      ]);
    };

    const handleAnomalyReset = ({ machineId }) => {
      toast.info(`✅ Anomaly cleared for machine`, { autoClose: 2000 });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('telemetry_update', handleTelemetryUpdate);
    socket.on('anomaly_injected', handleAnomalyInjected);
    socket.on('anomaly_reset', handleAnomalyReset);

    // Initial state check
    if (socket.connected) {
      setIsConnected(true);
      if (activeFactory?.id) {
        subscribeToFactoryTelemetry(activeFactory.id);
      }
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('telemetry_update', handleTelemetryUpdate);
      socket.off('anomaly_injected', handleAnomalyInjected);
      socket.off('anomaly_reset', handleAnomalyReset);
    };
  }, [activeFactory?.id]);

  // Handle active factory room changes
  useEffect(() => {
    if (activeFactory?.id) {
      subscribeToFactoryTelemetry(activeFactory.id);
      // Reset rolling history on factory switch
      setTelemetryHistory({});
      setTelemetryByMachine({});
      setAlarms([]);
    }
    return () => {
      if (activeFactory?.id) {
        unsubscribeFromFactoryTelemetry(activeFactory.id);
      }
    };
  }, [activeFactory?.id]);

  // Anomaly trigger helpers
  const injectAnomaly = useCallback((machineId, type = 'OVERHEAT') => {
    if (activeFactory?.id && machineId) {
      triggerMachineAnomaly(activeFactory.id, machineId, type);
    }
  }, [activeFactory?.id]);

  const resetAnomaly = useCallback((machineId) => {
    if (activeFactory?.id && machineId) {
      clearMachineAnomaly(activeFactory.id, machineId);
    }
  }, [activeFactory?.id]);

  const getMachineTelemetry = useCallback((machineId) => {
    return telemetryByMachine[machineId] || null;
  }, [telemetryByMachine]);

  const getMachineHistory = useCallback((machineId) => {
    return telemetryHistory[machineId] || [];
  }, [telemetryHistory]);

  return (
    <TelemetryContext.Provider value={{
      isConnected,
      packetCount,
      lastPacketTime,
      telemetryByMachine,
      telemetryHistory,
      aggregate,
      alarms,
      alarmHistory,
      injectAnomaly,
      resetAnomaly,
      getMachineTelemetry,
      getMachineHistory
    }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export default TelemetryContext;
