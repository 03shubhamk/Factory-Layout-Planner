import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Radio, Activity, Zap, Wifi, WifiOff } from 'lucide-react';

export default function LiveTelemetryBadge({ minimal = false }) {
  const { isConnected, packetCount, lastPacketTime } = useTelemetry();

  if (minimal) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
        isConnected 
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
          : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        <span>{isConnected ? 'LIVE IoT' : 'OFFLINE'}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border text-xs font-sans transition-all ${
      isConnected 
        ? 'bg-slate-900 text-slate-100 border-slate-700 shadow-sm' 
        : 'bg-rose-950/40 text-rose-300 border-rose-800'
    }`}>
      {/* Live Radio Pulse */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
        </span>
        <span className="font-bold tracking-tight font-mono text-[11px]">
          {isConnected ? 'OPC-UA / MQTT: LIVE' : 'GATEWAY: DISCONNECTED'}
        </span>
      </div>

      {isConnected && (
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 font-mono border-l border-slate-700 pl-3">
          <span>{packetCount} pkts</span>
          {lastPacketTime && <span>• {lastPacketTime}</span>}
        </div>
      )}
    </div>
  );
}
