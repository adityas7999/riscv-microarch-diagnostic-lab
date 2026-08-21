import React from 'react';
import { Scenario } from '../types';

interface HardwareStageCardsProps {
  scenario: Scenario;
  currentCycle: number;
}

export const HardwareStageCards: React.FC<HardwareStageCardsProps> = ({
  scenario,
  currentCycle,
}) => {
  const hardwareState = scenario.hardwareStagesPerCycle?.[currentCycle] || {
    cycle: currentCycle,
    IF: { status: 'Idle', details: 'No instruction' },
    ID: { status: 'Idle', details: 'No instruction' },
    EX: { status: 'Idle', details: 'No instruction' },
    MEM: { status: 'Idle', details: 'No instruction' },
    WB: { status: 'Idle', details: 'No instruction' },
  };

  const { IF, ID, EX, MEM, WB } = hardwareState;

  const isIFActive = IF.status && IF.status !== 'Idle';
  const isIDActive = ID.status && ID.status !== 'Idle';
  const isEXActive = EX.status && EX.status !== 'Idle';
  const isMEMActive = MEM.status && MEM.status !== 'Idle';
  const isWBActive = WB.status && WB.status !== 'Idle';

  return (
    <div id="hardware-stage-cards" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* IF Stage Card */}
      <div
        className={`bg-[#161922] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 relative overflow-hidden transition-all duration-200 border-t-2 border-t-[#3b82f6] shadow-md ${
          isIFActive ? 'glow-if ring-1 ring-blue-500/30' : 'opacity-85'
        }`}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-mono-code text-[11px] font-bold text-[#3b82f6] tracking-wider uppercase">
            IF Stage
          </span>
          {isIFActive && (
            <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
          )}
        </div>
        <div className="font-mono-code text-xs text-white font-semibold truncate">
          {IF.pc ? `PC: ${IF.pc}` : IF.instText || 'PC: -'}
        </div>
        <div className="font-mono-code text-[11px] text-slate-400 truncate">
          {IF.instHex ? `Inst: ${IF.instHex}` : IF.details || '-'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-code border ${
              IF.status === 'Active'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                : IF.status?.includes('Stall')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : IF.status === 'Frozen'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
            }`}
          >
            {IF.status || 'Idle'}
          </span>
        </div>
      </div>

      {/* ID Stage Card */}
      <div
        className={`bg-[#161922] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 relative overflow-hidden transition-all duration-200 border-t-2 border-t-[#10b981] shadow-md ${
          isIDActive ? 'glow-id ring-1 ring-emerald-500/30' : 'opacity-85'
        }`}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-mono-code text-[11px] font-bold text-[#10b981] tracking-wider uppercase">
            ID Stage
          </span>
          {isIDActive && (
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          )}
        </div>
        <div className="font-mono-code text-xs text-white font-semibold truncate" title={ID.instText}>
          {ID.instText || 'No Decode'}
        </div>
        <div className="font-mono-code text-[11px] text-slate-400 truncate" title={ID.details}>
          {ID.details || '-'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-code border ${
              ID.status === 'Decoding' || ID.status === 'Decode & Read'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : ID.status?.includes('Hazard') || ID.status?.includes('Hold')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : ID.status?.includes('Flush')
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
            }`}
          >
            {ID.status || 'Idle'}
          </span>
        </div>
      </div>

      {/* EX Stage Card */}
      <div
        className={`bg-[#161922] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 relative overflow-hidden transition-all duration-200 border-t-2 border-t-[#f59e0b] shadow-md ${
          isEXActive ? 'glow-ex ring-1 ring-amber-500/30' : 'opacity-85'
        }`}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-mono-code text-[11px] font-bold text-[#f59e0b] tracking-wider uppercase">
            EX Stage
          </span>
          {isEXActive && (
            <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
          )}
        </div>
        <div className="font-mono-code text-xs text-white font-semibold truncate" title={EX.instText}>
          {EX.instText || 'ALU Idle'}
        </div>
        <div className="font-mono-code text-[11px] text-slate-400 truncate" title={EX.details}>
          {EX.details || '-'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-code border ${
              EX.status === 'Computing'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : EX.status?.includes('Forwarding')
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-semibold'
                : EX.status?.includes('Branch') || EX.status?.includes('Mispredict')
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : EX.status === 'Bubble' || EX.status?.includes('Flush')
                ? 'bg-slate-800 text-amber-400 border-amber-500/20'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
            }`}
          >
            {EX.status || 'Idle'}
          </span>
          {EX.extraBadge && (
            <span className="text-[9px] font-mono-code text-pink-300 bg-pink-950/70 px-1.5 py-0.5 rounded border border-pink-500/40">
              {EX.extraBadge}
            </span>
          )}
        </div>
      </div>

      {/* MEM Stage Card */}
      <div
        className={`bg-[#161922] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 relative overflow-hidden transition-all duration-200 border-t-2 border-t-[#8b5cf6] shadow-md ${
          isMEMActive ? 'glow-mem ring-1 ring-purple-500/30' : 'opacity-85'
        }`}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-mono-code text-[11px] font-bold text-[#8b5cf6] tracking-wider uppercase">
            MEM Stage
          </span>
          {isMEMActive && (
            <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
          )}
        </div>
        <div className="font-mono-code text-xs text-white font-semibold truncate" title={MEM.instText}>
          {MEM.instText || 'No Bus Op'}
        </div>
        <div className="font-mono-code text-[11px] text-slate-400 truncate" title={MEM.details}>
          {MEM.details || '-'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-code border ${
              MEM.status === 'Writing Data' || MEM.status === 'Pass-through' || MEM.status === 'D-Cache Read'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                : MEM.status?.includes('Miss') || MEM.status?.includes('Wait')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
            }`}
          >
            {MEM.status || 'Idle'}
          </span>
          {MEM.extraBadge && (
            <span className="text-[9px] font-mono-code text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/40">
              {MEM.extraBadge}
            </span>
          )}
        </div>
      </div>

      {/* WB Stage Card */}
      <div
        className={`bg-[#161922] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 relative overflow-hidden transition-all duration-200 border-t-2 border-t-[#ef4444] shadow-md ${
          isWBActive ? 'glow-wb ring-1 ring-rose-500/30' : 'opacity-85'
        }`}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-mono-code text-[11px] font-bold text-[#ef4444] tracking-wider uppercase">
            WB Stage
          </span>
          {isWBActive && (
            <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
          )}
        </div>
        <div className="font-mono-code text-xs text-white font-semibold truncate" title={WB.instText}>
          {WB.instText || 'No Writeback'}
        </div>
        <div className="font-mono-code text-[11px] text-slate-400 truncate" title={WB.details}>
          {WB.details || '-'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-code border ${
              WB.status === 'Writeback' || WB.status === 'Branch Resolved' || WB.status === 'Retired'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
            }`}
          >
            {WB.status || 'Idle'}
          </span>
        </div>
      </div>
    </div>
  );
};
