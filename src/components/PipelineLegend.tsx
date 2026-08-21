import React from 'react';
import { Inbox, Binary, Zap, HardDrive, CheckCircle2, AlertTriangle, RefreshCw, CornerUpRight } from 'lucide-react';
import { PipelineStage } from '../types';

interface PipelineLegendProps {
  selectedStageFilter: string | null;
  onSelectStageFilter: (stage: string | null) => void;
}

export const PipelineLegend: React.FC<PipelineLegendProps> = ({
  selectedStageFilter,
  onSelectStageFilter,
}) => {
  const stages = [
    {
      id: 'IF',
      name: 'IF : Fetch',
      desc: 'Instruction Fetch (PC)',
      color: '#3b82f6',
      borderClass: 'border-l-[#3b82f6]',
      bgActive: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Inbox,
    },
    {
      id: 'ID',
      name: 'ID : Decode',
      desc: 'Instruction Decode & Reg Read',
      color: '#10b981',
      borderClass: 'border-l-[#10b981]',
      bgActive: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Binary,
    },
    {
      id: 'EX',
      name: 'EX : Execute',
      desc: 'ALU Op & Branch Target',
      color: '#f59e0b',
      borderClass: 'border-l-[#f59e0b]',
      bgActive: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: Zap,
    },
    {
      id: 'MEM',
      name: 'MEM: Memory',
      desc: 'D-Cache Read / Write',
      color: '#8b5cf6',
      borderClass: 'border-l-[#8b5cf6]',
      bgActive: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: HardDrive,
    },
    {
      id: 'WB',
      name: 'WB : Writeback',
      desc: 'Register File Commit',
      color: '#ef4444',
      borderClass: 'border-l-[#ef4444]',
      bgActive: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: CheckCircle2,
    },
  ];

  return (
    <div id="pipeline-legend" className="bg-[#161922] border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-xl">
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono-code text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Pipeline Legend
        </span>
        {selectedStageFilter && (
          <button
            onClick={() => onSelectStageFilter(null)}
            className="text-[10px] font-mono-code text-blue-400 hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isSelected = selectedStageFilter === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => onSelectStageFilter(isSelected ? null : stg.id)}
              className={`flex items-center justify-between text-left rounded-lg px-3 py-2 transition-all border-l-2 cursor-pointer ${stg.borderClass} ${
                isSelected
                  ? stg.bgActive
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" style={{ color: stg.color }} />
                <div>
                  <div className="font-mono-code text-xs font-semibold">{stg.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{stg.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hazard & Event Symbols */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-1.5 text-[11px] font-mono-code text-slate-400">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
          Hazard Signals
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-800 text-amber-400 flex items-center justify-center text-[9px] font-bold">--</span>
            <span className="text-slate-400">Pipeline Stall / Bubble</span>
          </div>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-pink-500/30"></span>
            <span className="text-slate-400">Forwarding Path Active</span>
          </div>
          <CornerUpRight className="w-3.5 h-3.5 text-pink-400" />
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-950/70 text-rose-400 flex items-center justify-center text-[8px] font-bold">FL</span>
            <span className="text-slate-400">Branch Flush (Squash)</span>
          </div>
          <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
        </div>
      </div>
    </div>
  );
};
