import pkg from '../client/node_modules/socket.io-client/dist/socket.io.js';
import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const io = pkg.io || pkg;

const API_BASE = 'http://localhost:5000/api';

function killProcess(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /T /PID ${proc.pid}`, { stdio: 'ignore' });
    } else {
      proc.kill('SIGKILL');
    }
  } catch {}
}

async function ensureServerRunning() {
  try {
    const res = await fetch('http://localhost:5000/health');
    if (res.ok) return null;
  } catch {
    // server not running yet
  }

  console.log('Starting local backend server on port 5000 for integration tests...');
  const serverProc = spawn(process.execPath, ['server.js'], {
    cwd: path.resolve(__dirname, '../server'),
    stdio: 'ignore'
  });

  const startTime = Date.now();
  while (Date.now() - startTime < 12000) {
    try {
      const res = await fetch('http://localhost:5000/health');
      if (res.ok) {
        console.log('✓ Backend server is ready and responding.\n');
        return serverProc;
      }
    } catch {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  killProcess(serverProc);
  throw new Error('Timed out waiting for backend server to start on port 5000');
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runIntegrationSuite() {
  console.log('\n======================================================');
  console.log('  Factory Layout Planner - Full Integration Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;
  let serverProc = null;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  try {
    serverProc = await ensureServerRunning();

    // 1. Healthcheck
    console.log('[1/12] Testing Health Endpoint...');
    const healthRes = await fetch('http://localhost:5000/health');
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /health returns 200 OK');

    // 2. Fetch all factories
    console.log('\n[2/12] Testing Factory Listing...');
    const listRes = await request('/factories');
    assert(listRes.ok && Array.isArray(listRes.data), 'GET /api/factories returns list');

    // 3. Create a Test Factory
    console.log('\n[3/12] Testing Factory Creation...');
    const createFactoryRes = await request('/factories', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Automated Test Gigafactory',
        length: 80,
        width: 45,
        departmentCount: 3,
        description: 'Temporary factory created for comprehensive test suite validation.'
      })
    });
    assert(createFactoryRes.status === 201 && createFactoryRes.data.id, 'POST /api/factories creates new factory');
    const factoryId = createFactoryRes.data.id;

    // 4. Get Factory Details
    console.log('\n[4/12] Testing Factory Fetch by ID...');
    const detailRes = await request(`/factories/${factoryId}`);
    assert(detailRes.ok && detailRes.data.name === 'Automated Test Gigafactory', 'GET /api/factories/:id returns created factory');

    // 5. Add Machines
    console.log('\n[5/12] Testing Machine Node Creation...');
    const m1Res = await request(`/factories/${factoryId}/machines`, {
      method: 'POST',
      body: JSON.stringify({
        machineName: 'Precision CNC Mill',
        machineType: 'Machining',
        x: 10,
        y: 10,
        orientation: 0,
        status: 'Running',
        throughput: 120,
        load: 65
      })
    });
    const m2Res = await request(`/factories/${factoryId}/machines`, {
      method: 'POST',
      body: JSON.stringify({
        machineName: 'Robotic Welding Cell',
        machineType: 'Welding',
        x: 30,
        y: 20,
        orientation: 90,
        status: 'Idle',
        throughput: 85,
        load: 40
      })
    });
    assert(m1Res.status === 201 && m1Res.data.id, 'POST /factories/:id/machines creates Machine 1');
    assert(m2Res.status === 201 && m2Res.data.id, 'POST /factories/:id/machines creates Machine 2');
    const m1Id = m1Res.data.id;
    const m2Id = m2Res.data.id;

    // 6. Update Machine (position & orientation)
    console.log('\n[6/12] Testing Machine Node Update (Repositioning & Status)...');
    const updateRes = await request(`/factories/${factoryId}/machines/${m1Id}`, {
      method: 'PUT',
      body: JSON.stringify({
        x: 15.5,
        y: 12.0,
        orientation: 180,
        status: 'Running'
      })
    });
    assert(updateRes.ok && updateRes.data.x === 15.5 && updateRes.data.orientation === 180, 'PUT /factories/:id/machines/:machineId updates coordinate and orientation');

    // 7. Configure Production Flow
    console.log('\n[7/12] Testing Production Flow Sequence Setup...');
    const flowRes = await request(`/factories/${factoryId}/flow`, {
      method: 'POST',
      body: JSON.stringify({
        steps: [m1Id, m2Id]
      })
    });
    assert(flowRes.ok && Array.isArray(flowRes.data) && flowRes.data.length === 2, 'POST /factories/:id/flow establishes 2-step flow');

    // 8. Fetch Production Flow
    console.log('\n[8/12] Testing Production Flow Retrieval...');
    const getFlowRes = await request(`/factories/${factoryId}/flow`);
    assert(getFlowRes.ok && getFlowRes.data[0].machineId === m1Id && getFlowRes.data[1].machineId === m2Id, 'GET /factories/:id/flow returns correct sequence');

    // 9. Save Analytical Report
    console.log('\n[9/12] Testing Report Generation & Persistence...');
    const reportRes = await request(`/factories/${factoryId}/reports`, {
      method: 'POST',
      body: JSON.stringify({
        distance: 22.5,
        efficiency: 88.75,
        rating: 'Excellent',
        suggestions: [{ title: 'Path Optimization', priority: 'Low' }]
      })
    });
    assert(reportRes.status === 201 && reportRes.data.rating === 'Excellent', 'POST /factories/:id/reports saves analytical report');

    const getReportsRes = await request(`/factories/${factoryId}/reports`);
    assert(getReportsRes.ok && getReportsRes.data.length > 0, 'GET /factories/:id/reports retrieves persisted reports');

    // 10. WebSocket Telemetry & IoT Streaming
    console.log('\n[10/12] Testing Real-Time WebSocket Telemetry Gateway...');
    await new Promise((resolve, reject) => {
      const socket = io('http://localhost:5000', {
        transports: ['websocket'],
        timeout: 5000
      });

      const timer = setTimeout(() => {
        socket.disconnect();
        assert(false, 'WebSocket telemetry timed out');
        resolve();
      }, 7000);

      socket.on('connect', () => {
        assert(true, 'WebSocket client connected to IoT Gateway');
        socket.emit('join_factory_stream', factoryId);
      });

      socket.on('telemetry_update', (data) => {
        if (data.factoryId === factoryId) {
          clearTimeout(timer);
          assert(true, `Received live telemetry stream event for factory (Machines: ${Array.isArray(data.machines) ? data.machines.length : 0})`);
          socket.disconnect();
          resolve();
        }
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        assert(false, `WebSocket connection error: ${err.message}`);
        socket.disconnect();
        resolve();
      });
    });

    // 11. IoT Anomaly Injection & External Ingestion
    console.log('\n[11/12] Testing Edge Anomaly Injection & OPC-UA Ingestion...');
    const injectRes = await request(`/factories/${factoryId}/telemetry/inject-anomaly`, {
      method: 'POST',
      body: JSON.stringify({
        machineId: m1Id,
        type: 'OVERHEAT'
      })
    });
    assert(injectRes.ok && injectRes.data.success, 'POST /telemetry/inject-anomaly triggers OVERHEAT condition');

    const resetRes = await request(`/factories/${factoryId}/telemetry/reset-anomaly`, {
      method: 'POST',
      body: JSON.stringify({
        machineId: m1Id
      })
    });
    assert(resetRes.ok && resetRes.data.success, 'POST /telemetry/reset-anomaly resets condition to nominal');

    const publishRes = await request(`/factories/${factoryId}/telemetry/publish`, {
      method: 'POST',
      body: JSON.stringify({
        machineId: m1Id,
        payload: { temperature: 62.4, vibration: 1.1, power: 14.5 }
      })
    });
    assert(publishRes.ok && publishRes.data.success, 'POST /telemetry/publish ingests custom edge payload');

    // 12. Cleanup (Delete Machine and Factory)
    console.log('\n[12/12] Testing Cleanup (Delete Machine & Factory)...');
    const delMachineRes = await request(`/factories/${factoryId}/machines/${m2Id}`, {
      method: 'DELETE'
    });
    assert(delMachineRes.ok, 'DELETE /factories/:id/machines/:machineId removes machine');

    const delFactoryRes = await request(`/factories/${factoryId}`, {
      method: 'DELETE'
    });
    assert(delFactoryRes.ok, 'DELETE /factories/:id removes test factory');

  } catch (error) {
    console.error('Unexpected test exception:', error);
    failed++;
  } finally {
    killProcess(serverProc);
  }

  console.log('\n------------------------------------------------------');
  console.log(`Integration Test Results: ${passed} passed, ${failed} failed.`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationSuite();
