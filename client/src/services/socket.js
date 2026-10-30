import { io } from 'socket.io-client';

let socket = null;
let reconnectCallbacks = [];

export function getSocket() {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 10000,
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Factory IoT Gateway via WebSocket:', socket.id);
      reconnectCallbacks.forEach(cb => cb(true));
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from IoT Gateway:', reason);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.warn('IoT Gateway connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('✅ Reconnected after', attemptNumber, 'attempts');
      reconnectCallbacks.forEach(cb => cb(true));
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt:', attemptNumber);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after max attempts');
      reconnectCallbacks.forEach(cb => cb(false));
    });
  }

  return socket;
}

export function onReconnect(callback) {
  reconnectCallbacks.push(callback);
  return () => {
    reconnectCallbacks = reconnectCallbacks.filter(cb => cb !== callback);
  };
}

export function forceReconnect() {
  if (socket) {
    socket.disconnect();
    socket.connect();
  }
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