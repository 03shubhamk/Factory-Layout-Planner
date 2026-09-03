import { io } from 'socket.io-client';

// Socket singleton connection
let socket = null;

export function getSocket() {
  if (!socket) {
    // Connect to server port 5000 (with auto reconnect)
    socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Factory IoT Gateway via WebSocket:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from IoT Gateway:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('IoT Gateway connection error:', error.message);
    });
  }

  return socket;
}

export function subscribeToFactoryTelemetry(factoryId) {
  const s = getSocket();
  if (s && factoryId) {
    s.emit('join_factory_stream', factoryId);
  }
}

export function unsubscribeFromFactoryTelemetry(factoryId) {
  const s = getSocket();
  if (s && factoryId) {
    s.emit('leave_factory_stream', factoryId);
  }
}

export function triggerMachineAnomaly(factoryId, machineId, type = 'OVERHEAT') {
  const s = getSocket();
  if (s && factoryId && machineId) {
    s.emit('inject_anomaly', { factoryId, machineId, type });
  }
}

export function clearMachineAnomaly(factoryId, machineId) {
  const s = getSocket();
  if (s && factoryId && machineId) {
    s.emit('reset_anomaly', { factoryId, machineId });
  }
}
