import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { useTelemetry } from '../context/TelemetryContext';
import LiveTelemetryBadge from '../components/LiveTelemetryBadge';
import MachineTelemetryDrawer from '../components/MachineTelemetryDrawer';
import { 
  Activity, 
  Flame, 
  Zap, 
  Gauge, 
  ShieldAlert, 
  Cpu, 
  Radio, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  Sliders,
  Send,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function LiveCommandCenter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeFactory, machines, loadFactoryDetails } = useFactory();
  const { 
    isConnected, 
    packetCount, 
    lastPacketTime, 
    telemetryByMachine, 
    aggregate, 
    alarms, 
    alarmHistory,
    injectAnomaly, 
    resetAnomaly 
  } = useTelemetry();

  const [selectedMachineForDrawer, setSelectedMachineForDrawer] = useState(null);
  const [customPayloadJson, setCustomPayloadJson] = useState('{\n  "temp": 82.5,\n  "vibration": 5.2,\n  "rpm": 2800,\n  "powerKw": 35.0\n}');

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id]);

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle manual external MQTT push
  const handleSendExternalMqtt = async () => {
    if (machines.length === 0) return;
    try {
      const parsed = JSON.parse(customPayloadJson);
      const targetMachine = machines[0];

      const res = await fetch(`http://localhost:5000/api/factories/${activeFactory.id}/telemetry/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: targetMachine.id,
          payload: parsed
        })
      });

      if (res.ok) {
        toast.success(`Simulated MQTT payload ingested for ${targetMachine.machineName}!`);
      }
    } catch (err) {
      toast.error('Invalid JSON payload or server error.');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950 text-slate-100 space-y-8 font-sans">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`/designer/${activeFactory.id}`)}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Radio className="w-7 h-7 text-emerald-400 animate-pulse" />
              Live MES Command Center & IIoT Fleet
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            FACTORY: {activeFactory.name.toUpperCase()} • REAL-TIME OPC-UA & MQTT TELEMETRY INGESTION GATEWAY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LiveTelemetryBadge />
          <button
            onClick={() => navigate(`/designer/${activeFactory.id}`)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all shadow-soft"
          >
            Open Floor Canvas
          </button>
        </div>
      </div>

      {/* Factory Aggregate KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Fleet Health */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fleet Health</span>
            <CheckCircle2 className={`w-4 h-4 ${aggregate.fleetHealth > 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-black font-mono ${
              aggregate.fleetHealth > 80 ? 'text-emerald-400' : aggregate.fleetHealth > 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {aggregate.fleetHealth}%
            </span>
            <span className="text-xs text-slate-500 font-mono">OEE</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                aggregate.fleetHealth > 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${aggregate.fleetHealth}%` }}
            />
          </div>
        </div>

        {/* Total Power Draw */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Power</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-amber-300">
              {aggregate.totalPowerKw}
            </span>
            <span className="text-xs text-slate-400 font-mono">kW</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Live Factory Load</span>
        </div>

        {/* Average Temperature */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Thermal</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white">
              {aggregate.avgTemp}
            </span>
            <span className="text-xs text-slate-400 font-mono">°C</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Operating Temp</span>
        </div>

        {/* Active Alarms */}
        <div className={`p-4 rounded-xl border transition-all ${
          aggregate.activeAlarmCount > 0 
            ? 'bg-rose-950/30 border-rose-800/80 shadow-lg shadow-rose-950/30' 
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Alarms</span>
            <ShieldAlert className={`w-4 h-4 ${aggregate.activeAlarmCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-black font-mono ${aggregate.activeAlarmCount > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {aggregate.activeAlarmCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">Active</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            {aggregate.activeAlarmCount > 0 ? 'Requires Operator Action' : 'All Systems Nominal'}
          </span>
        </div>

        {/* Machines Online */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fleet Status</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-emerald-400">
              {aggregate.runningCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {aggregate.totalMachines} Online</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">Production Assets</span>
        </div>
      </div>

      {/* Main Content Layout: Fleet Grid + Alarms / Ingestion Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Fleet Machine Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Machine Telemetry Grid ({machines.length} Units)
            </h2>
            <span className="text-xs text-slate-400 font-mono">Click card to open live waveforms</span>
          </div>

          {machines.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No machinery placed on this layout</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Open the layout designer to drag and drop production nodes onto your floor plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {machines.map((mach) => {
                const tel = telemetryByMachine[mach.id] || {
                  temp: 45,
                  vibration: 1.2,
                  rpm: 1200,
                  powerKw: 12.0,
                  load: mach.load || 50,
                  healthScore: 98,
                  status: mach.status,
                  alert: null
                };

                const isMachAlarm = tel.status === 'Alarm' || tel.alert !== null;
                const isMachRunning = tel.status === 'Running';

                return (
                  <div
                    key={mach.id}
                    onClick={() => setSelectedMachineForDrawer(mach)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group hover:scale-[1.01] ${
                      isMachAlarm 
                        ? 'bg-rose-950/40 border-rose-700/80 shadow-lg shadow-rose-950/20' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                            {mach.machineName}
                          </h3>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                            isMachAlarm 
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                              : isMachRunning 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {tel.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{mach.machineType} • ({mach.x}m, {mach.y}m)</span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black font-mono text-emerald-400 block">{tel.healthScore}%</span>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">Health</span>
                      </div>
                    </div>

                    {/* Sensor Metrics Dials */}
                    <div className="grid grid-cols-4 gap-2 py-3 text-center">
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">Temp</span>
                        <span className={`text-xs font-black font-mono mt-0.5 block ${tel.temp > 75 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                          {tel.temp}°C
                        </span>
                      </div>

                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">Vib</span>
                        <span className={`text-xs font-black font-mono mt-0.5 block ${tel.vibration > 4.5 ? 'text-amber-400' : 'text-white'}`}>
                          {tel.vibration}
                        </span>
                      </div>

                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">RPM</span>
                        <span className="text-xs font-black font-mono mt-0.5 block text-white">
                          {tel.rpm}
                        </span>
                      </div>

                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">Power</span>
                        <span className="text-xs font-black font-mono mt-0.5 block text-amber-300">
                          {tel.powerKw}k
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Anomaly Injector */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => injectAnomaly(mach.id, 'OVERHEAT')}
                        title="Inject Overheat"
                        className="flex-1 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded text-[10px] font-semibold flex items-center justify-center gap-1"
                      >
                        <Flame className="w-3 h-3 text-rose-400" />
                        <span>Heat</span>
                      </button>

                      <button
                        onClick={() => injectAnomaly(mach.id, 'VIBRATION')}
                        title="Inject Vibration"
                        className="flex-1 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded text-[10px] font-semibold flex items-center justify-center gap-1"
                      >
                        <Activity className="w-3 h-3 text-amber-400" />
                        <span>Vib</span>
                      </button>

                      <button
                        onClick={() => resetAnomaly(mach.id)}
                        title="Reset Sensor"
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[10px] font-semibold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Live Alarms Log & MQTT Edge Ingestion Simulator */}
        <div className="space-y-6">
          
          {/* Active Industrial Alarms Feed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Live Industrial Alarms
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
                {alarms.length} ACTIVE
              </span>
            </div>

            {alarms.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                <p className="font-semibold text-slate-400">Zero active telemetry anomalies</p>
                <p className="text-[10px]">Fleet operating within standard safety limits</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {alarms.map((alarm, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      alarm.level === 'Critical' 
                        ? 'bg-rose-950/50 border-rose-800 text-rose-200' 
                        : 'bg-amber-950/50 border-amber-800 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-[11px] uppercase tracking-wider">
                        {alarm.machineName}
                      </span>
                      <span className="text-[10px] opacity-70 font-mono">
                        {new Date(alarm.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{alarm.message}</p>
                    <button
                      onClick={() => resetAnomaly(alarm.machineId)}
                      className="text-[10px] font-bold underline text-white hover:opacity-80 pt-1 block"
                    >
                      Acknowledge & Clear Anomaly
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MQTT / OPC-UA Direct Ingestion Simulator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                MQTT / OPC-UA Simulator
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">PORT: 5000</span>
            </div>

            <p className="text-xs text-slate-400">
              Test external edge device payloads pushed directly into the backend ingestion endpoint:
            </p>

            <textarea
              value={customPayloadJson}
              onChange={(e) => setCustomPayloadJson(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-emerald-400 outline-none focus:border-primary transition-all resize-none"
            />

            <button
              onClick={handleSendExternalMqtt}
              disabled={machines.length === 0}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Telemetry Payload</span>
            </button>
          </div>

        </div>

      </div>

      {/* Slide-over Machine Telemetry Drawer */}
      {selectedMachineForDrawer && (
        <MachineTelemetryDrawer 
          machine={selectedMachineForDrawer} 
          onClose={() => setSelectedMachineForDrawer(null)} 
        />
      )}

    </div>
  );
}
