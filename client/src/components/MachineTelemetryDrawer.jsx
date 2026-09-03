import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { 
  X, 
  Activity, 
  Flame, 
  Zap, 
  AlertTriangle, 
  RotateCw, 
  Gauge, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  ShieldAlert,
  Power
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';

export default function MachineTelemetryDrawer({ machine, onClose }) {
  const { 
    getMachineTelemetry, 
    getMachineHistory, 
    injectAnomaly, 
    resetAnomaly,
    isConnected 
  } = useTelemetry();

  if (!machine) return null;

  const telemetry = getMachineTelemetry(machine.id) || {
    temp: 45,
    vibration: 1.2,
    rpm: 1200,
    powerKw: 12.0,
    load: machine.load || 50,
    healthScore: 98,
    cycleCount: 1420,
    status: machine.status,
    alert: null
  };

  const history = getMachineHistory(machine.id);

  // Status Colors
  const isAlarm = telemetry.status === 'Alarm' || telemetry.alert !== null;
  const isRunning = telemetry.status === 'Running';
  const isOverheating = telemetry.temp > 75;
  const isHighVibration = telemetry.vibration > 4.5;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[540px] bg-slate-900 text-slate-100 shadow-2xl z-50 flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300 font-sans">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border ${
            isAlarm 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
              : isRunning 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white tracking-tight">{machine.machineName}</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isAlarm 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                  : isRunning 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {telemetry.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              TYPE: {machine.machineType} • POS: ({machine.x}m, {machine.y}m)
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Alarm Banner */}
      {telemetry.alert && (
        <div className={`p-4 flex items-start gap-3 border-b shrink-0 ${
          telemetry.alert.level === 'Critical' 
            ? 'bg-rose-950/70 border-rose-800 text-rose-200' 
            : 'bg-amber-950/70 border-amber-800 text-amber-200'
        }`}>
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                {telemetry.alert.level} ALARM: {telemetry.alert.code}
              </span>
              <button 
                onClick={() => resetAnomaly(machine.id)}
                className="text-[11px] underline font-bold hover:text-white"
              >
                Clear
              </button>
            </div>
            <p className="text-xs mt-0.5 opacity-90">{telemetry.alert.message}</p>
          </div>
        </div>
      )}

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Temperature */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            isOverheating 
              ? 'bg-rose-950/40 border-rose-700/60 shadow-lg shadow-rose-950/30' 
              : 'bg-slate-950/50 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Temperature</span>
              <Flame className={`w-4 h-4 ${isOverheating ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-2xl font-black font-mono ${isOverheating ? 'text-rose-400' : 'text-white'}`}>
                {telemetry.temp}
              </span>
              <span className="text-xs text-slate-400 font-mono">°C</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Limit: &lt; 75°C</div>
          </div>

          {/* Vibration */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            isHighVibration 
              ? 'bg-amber-950/40 border-amber-700/60 shadow-lg shadow-amber-950/30' 
              : 'bg-slate-950/50 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Vibration</span>
              <Activity className={`w-4 h-4 ${isHighVibration ? 'text-amber-400 animate-pulse' : 'text-blue-400'}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-2xl font-black font-mono ${isHighVibration ? 'text-amber-400' : 'text-white'}`}>
                {telemetry.vibration}
              </span>
              <span className="text-xs text-slate-400 font-mono">mm/s</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">RMS Harmonics</div>
          </div>

          {/* Motor / Spindle Speed */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Spindle</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-white">
                {telemetry.rpm}
              </span>
              <span className="text-xs text-slate-400 font-mono">RPM</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Velocity Index</div>
          </div>

          {/* Power Consumption */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Power</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-white">
                {telemetry.powerKw}
              </span>
              <span className="text-xs text-slate-400 font-mono">kW</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Active Load</div>
          </div>

          {/* Live Load */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Load %</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-white">
                {telemetry.load}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  telemetry.load > 85 ? 'bg-rose-500' : telemetry.load > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${telemetry.load}%` }}
              />
            </div>
          </div>

          {/* Health Score */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Health</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-2xl font-black font-mono ${
                telemetry.healthScore > 80 ? 'text-emerald-400' : telemetry.healthScore > 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {telemetry.healthScore}%
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">OEE & MTBF Index</div>
          </div>
        </div>

        {/* Live Real-time Charts */}
        <div className="space-y-4">
          
          {/* Temperature Streaming Chart */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-200">Real-Time Temperature Waveform (°C)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                STREAMING
              </span>
            </div>

            <div className="h-36 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis domain={[20, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Warn 75°C', fill: '#F59E0B', fontSize: 10 }} />
                  <ReferenceLine y={85} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Crit 85°C', fill: '#EF4444', fontSize: 10 }} />
                  <Area type="monotone" dataKey="temp" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vibration RMS & Power Chart */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Vibration (mm/s) & Power (kW)</span>
              </div>
            </div>

            <div className="h-36 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <Line type="monotone" dataKey="vibration" stroke="#38BDF8" strokeWidth={2} dot={false} isAnimationActive={false} name="Vibration (mm/s)" />
                  <Line type="monotone" dataKey="powerKw" stroke="#FBBF24" strokeWidth={1.5} strokeDasharray="4 2" dot={false} isAnimationActive={false} name="Power (kW)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Industrial Anomaly Testing Console */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              IIoT Fault / Anomaly Injector
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Edge Simulation</span>
          </div>
          <p className="text-xs text-slate-400">
            Inject realistic sensor faults to test real-time MES telemetry reaction, alarm propagation, and automatic floor alerts.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => injectAnomaly(machine.id, 'OVERHEAT')}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all justify-center"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Overheat Spike</span>
            </button>

            <button
              onClick={() => injectAnomaly(machine.id, 'VIBRATION')}
              className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all justify-center"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Bearing Failure</span>
            </button>

            <button
              onClick={() => injectAnomaly(machine.id, 'SPINDLE_JAM')}
              className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all justify-center"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
              <span>Spindle Jam</span>
            </button>

            <button
              onClick={() => injectAnomaly(machine.id, 'POWER_SURGE')}
              className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all justify-center"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Power Surge</span>
            </button>
          </div>

          <button
            onClick={() => resetAnomaly(machine.id)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Restore Normal Telemetry</span>
          </button>
        </div>

      </div>

    </div>
  );
}
