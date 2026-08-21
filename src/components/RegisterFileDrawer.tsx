import React from 'react';
import { X, Layers, Terminal, ChevronRight } from 'lucide-react';
import { Scenario } from '../types';

interface RegisterFileDrawerProps {
  scenario: Scenario;
  currentCycle: number;
  showRegisters: boolean;
  onCloseRegisters: () => void;
  showTerminal: boolean;
  onCloseTerminal: () => void;
}

export const RegisterFileDrawer: React.FC<RegisterFileDrawerProps> = ({
  scenario,
  currentCycle,
  showRegisters,
  onCloseRegisters,
  showTerminal,
  onCloseTerminal,
}) => {
  if (!showRegisters && !showTerminal) return null;

  const currentHardwareState = scenario.hardwareStagesPerCycle?.[currentCycle];
  const registers = currentHardwareState?.registers || {
    x0: 0,
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
    x5: 0,
    x6: 0,
    x7: 0,
  };

  const regNames: Record<string, string> = {
    x0: 'zero',
    x1: 'ra',
    x2: 'sp',
    x3: 'gp',
    x4: 'tp',
    x5: 't0',
    x6: 't1',
    x7: 't2',
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md w-full flex flex-col gap-3 shadow-2xl">
      {/* Register File Modal / Panel */}
      {showRegisters && (
        <div className="bg-[#161922] rounded-xl p-4 border border-slate-800 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h4 className="font-mono-code text-xs font-bold text-white uppercase tracking-wider">
                RISC-V Register File (RF) • Cycle {currentCycle}
              </h4>
            </div>
            <button
              onClick={onCloseRegisters}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 font-mono-code text-xs">
            {Object.entries(registers).map(([reg, val]) => (
              <div
                key={reg}
                className="bg-[#0F1117] p-2 rounded-lg border border-slate-800/80 flex flex-col"
              >
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-bold">{reg}</span>
                  <span className="text-slate-500">{regNames[reg] || ''}</span>
                </div>
                <div className="text-white font-semibold truncate mt-0.5" title={String(val)}>
                  {typeof val === 'number' ? `0x${val.toString(16).toUpperCase()}` : val}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono-code text-slate-500 flex justify-between items-center">
            <span>x0 is hardwired to 0</span>
            <span>RV32I 32-bit registers</span>
          </div>
        </div>
      )}

      {/* Terminal Hardware Signals Panel */}
      {showTerminal && (
        <div className="bg-[#161922] rounded-xl p-4 border border-slate-800 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h4 className="font-mono-code text-xs font-bold text-white uppercase tracking-wider">
                Microarchitecture Bus Monitor
              </h4>
            </div>
            <button
              onClick={onCloseTerminal}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#0a0c11] p-3 rounded-lg border border-slate-800 font-mono-code text-[11px] text-slate-300 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            <div className="text-blue-400">[C{currentCycle}] IF: {currentHardwareState?.IF?.details || 'N/A'}</div>
            <div className="text-emerald-400">[C{currentCycle}] ID: {currentHardwareState?.ID?.details || 'N/A'}</div>
            <div className="text-amber-400">[C{currentCycle}] EX: {currentHardwareState?.EX?.details || 'N/A'}</div>
            <div className="text-purple-400">[C{currentCycle}] MEM: {currentHardwareState?.MEM?.details || 'N/A'}</div>
            <div className="text-rose-400">[C{currentCycle}] WB: {currentHardwareState?.WB?.details || 'N/A'}</div>
            {currentHardwareState?.activeForwarding && currentHardwareState.activeForwarding.length > 0 && (
              <div className="text-pink-400 font-bold">
                [FWD] Active: {currentHardwareState.activeForwarding.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
