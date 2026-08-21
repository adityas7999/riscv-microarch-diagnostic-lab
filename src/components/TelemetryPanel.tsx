import React from 'react';
import { Activity, Gauge, Flame, AlertOctagon, RefreshCw } from 'lucide-react';
import { Scenario } from '../types';

interface TelemetryPanelProps {
  scenario: Scenario;
  currentCycle: number;
  onSelectCycle: (cycle: number) => void;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  scenario,
  currentCycle,
  onSelectCycle,
}) => {
  const maxCycles = scenario.pipelineTrace.length || scenario.cycles;
  const ipcPercent = Math.min(100, Math.round(scenario.ipc * 100));

  // Compute live instructions retired up to current cycle
  let retiredCount = 0;
  for (let c = 1; c <= currentCycle; c++) {
    const wbState = scenario.hardwareStagesPerCycle?.[c]?.WB;
    if (wbState && wbState.status === 'Writeback') {
      retiredCount++;
    }
  }

  // Theoretical CPI (Cycles Per Instruction)
  const cpi = scenario.ipc > 0 ? (1 / scenario.ipc).toFixed(2) : '0.00';

  return (
    <div id="telemetry-panel" className="bg-[#161922] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-xs uppercase tracking-widest font-bold text-blue-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
          Real-Time Metrics
        </h2>
        <span className="text-[10px] font-mono-code text-slate-500 bg-[#0F1117] px-2 py-0.5 rounded border border-slate-800 uppercase">
          Live Monitor
        </span>
      </div>

      {/* Primary Metrics: IPC Rate & Clock Cycles (2-column layout matching design HTML) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[#0F1117] p-3.5 sm:p-4 rounded-lg border border-slate-800/70 text-center flex flex-col items-center justify-center">
          <p className="text-xs text-slate-400 opacity-60 mb-1 uppercase tracking-tighter">IPC Rate</p>
          <p id="metric-ipc" className="text-2xl sm:text-3xl font-mono-code font-bold text-emerald-400">
            {scenario.ipc.toFixed(2)}
          </p>
        </div>

        <div className="bg-[#0F1117] p-3.5 sm:p-4 rounded-lg border border-slate-800/70 text-center flex flex-col items-center justify-center">
          <p className="text-xs text-slate-400 opacity-60 mb-1 uppercase tracking-tighter">Clock Cycles</p>
          <p id="metric-cycles" className="text-2xl sm:text-3xl font-mono-code font-bold text-white">
            {maxCycles}
          </p>
        </div>
      </div>

      {/* IPC Progress Meter & CPI */}
      <div className="bg-[#0F1117] p-3 rounded-lg border border-slate-800/60 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[11px] font-mono-code text-slate-400">
          <span>Pipeline Efficiency</span>
          <span className="text-slate-300 font-semibold">{ipcPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              scenario.ipc >= 0.5
                ? 'bg-emerald-400'
                : scenario.ipc >= 0.3
                ? 'bg-blue-400'
                : 'bg-amber-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(10, ipcPercent))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
          <span>CPI: {cpi}</span>
          <span>Instructions: {scenario.instructionCount || 2}</span>
        </div>
      </div>

      {/* Stalls & Flushes Badges */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#0F1117] p-2.5 rounded-lg border border-slate-800/60 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[10px] font-mono-code text-slate-400 uppercase">
            <AlertOctagon className="w-3 h-3 text-amber-400" />
            <span>Stalls</span>
          </div>
          <span className="font-mono-code text-lg font-bold text-amber-400 mt-0.5">
            {scenario.stalls ?? 0}
          </span>
        </div>

        <div className="bg-[#0F1117] p-2.5 rounded-lg border border-slate-800/60 flex flex-col items-center">
          <div className="flex items-center gap-1 text-[10px] font-mono-code text-slate-400 uppercase">
            <RefreshCw className="w-3 h-3 text-rose-400" />
            <span>Flushes</span>
          </div>
          <span className="font-mono-code text-lg font-bold text-rose-400 mt-0.5">
            {scenario.flushes ?? 0}
          </span>
        </div>
      </div>

      {/* Interactive Cycle Timeline Scrubber */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
        <div className="flex justify-between items-center text-xs font-mono-code">
          <span className="text-slate-400 text-[11px]">Timeline Scrubber:</span>
          <span className="text-blue-400 font-bold">
            Cycle {currentCycle} / {maxCycles}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={maxCycles}
          value={currentCycle}
          onChange={(e) => onSelectCycle(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[9px] font-mono-code text-slate-500">
          <span>C1 Start</span>
          <span>Retired: {retiredCount} inst</span>
          <span>C{maxCycles} End</span>
        </div>
      </div>
    </div>
  );
};
