import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react';
import { Scenario, PipelineStage } from '../types';
import { computeMatrixRows } from '../utils/matrixHelper';

interface ExecutionTraceMatrixProps {
  scenario: Scenario;
  currentCycle: number;
  onSelectCycle: (cycle: number) => void;
  selectedStageFilter: string | null;
}

export const ExecutionTraceMatrix: React.FC<ExecutionTraceMatrixProps> = ({
  scenario,
  currentCycle,
  onSelectCycle,
  selectedStageFilter,
}) => {
  const [zoomLevel, setZoomLevel] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [hoveredCell, setHoveredCell] = useState<{
    instruction: string;
    cycle: number;
    stage: string;
    note?: string;
  } | null>(null);

  // Compute rows dynamically from the scenario
  const rows = computeMatrixRows(scenario.code, scenario.pipelineTrace);
  const totalCycles = scenario.pipelineTrace.length;
  const cycleList = Array.from({ length: totalCycles }, (_, i) => i + 1);

  const getCellSizeClass = () => {
    switch (zoomLevel) {
      case 'compact':
        return {
          colWidth: 'min-w-[36px] w-[36px]',
          badgeSize: 'w-7 h-5 text-[10px]',
          instColWidth: 'min-w-[140px] max-w-[200px] text-xs',
        };
      case 'spacious':
        return {
          colWidth: 'min-w-[60px] w-[60px]',
          badgeSize: 'w-10 h-7 text-xs font-bold',
          instColWidth: 'min-w-[200px] max-w-[280px] text-sm',
        };
      case 'normal':
      default:
        return {
          colWidth: 'min-w-[46px] w-[46px]',
          badgeSize: 'w-8 h-6 text-xs',
          instColWidth: 'min-w-[160px] max-w-[240px] text-xs sm:text-sm',
        };
    }
  };

  const sizes = getCellSizeClass();

  const renderStageBadge = (stageInfo?: {
    stage: PipelineStage | 'STALL' | 'FLUSH' | 'FREEZE' | 'NOP' | '-';
    rawText: string;
    hasForwarding?: boolean;
    forwardingNote?: string;
    isStall?: boolean;
    isFlush?: boolean;
  }) => {
    if (!stageInfo || stageInfo.stage === '-') {
      return null;
    }

    const { stage, rawText, hasForwarding, isStall, isFlush } = stageInfo;

    // Filter check
    const isMuted =
      selectedStageFilter &&
      selectedStageFilter !== stage &&
      !((selectedStageFilter === 'EX' || selectedStageFilter === 'MEM') && hasForwarding);

    let badgeClasses = 'inline-flex items-center justify-center font-mono-code font-bold rounded transition-all select-none ';
    let badgeText: string = stage;

    switch (stage) {
      case 'IF':
        badgeClasses += 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/50';
        badgeText = 'IF';
        break;
      case 'ID':
        badgeClasses += 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50';
        badgeText = 'ID';
        break;
      case 'EX':
        badgeClasses += 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/50';
        badgeText = 'EX';
        break;
      case 'MEM':
        badgeClasses += 'bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/50';
        badgeText = 'M';
        break;
      case 'WB':
        badgeClasses += 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50';
        badgeText = 'WB';
        break;
      case 'STALL':
      case 'NOP':
        badgeClasses += 'bg-[#333535]/80 text-[#8e9192] border border-[#444748]/60 font-normal';
        badgeText = '--';
        break;
      case 'FLUSH':
        badgeClasses += 'bg-red-950/40 text-red-400 border border-red-500/40 font-semibold';
        badgeText = 'FL';
        break;
      case 'FREEZE':
        badgeClasses += 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 font-semibold';
        badgeText = 'FRZ';
        break;
      default:
        badgeClasses += 'bg-white/10 text-white border border-white/20';
        badgeText = stage;
    }

    if (isMuted) {
      badgeClasses += ' opacity-20 saturate-50';
    }

    return (
      <div className="relative inline-block">
        <span className={`${sizes.badgeSize} ${badgeClasses}`} title={rawText}>
          {badgeText}
        </span>
        {hasForwarding && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-[#121414] animate-pulse cursor-help"
            title={`Forwarding Path Active: ${rawText}`}
          />
        )}
      </div>
    );
  };

  return (
    <div id="execution-trace-matrix" className="bg-[#161922] border border-slate-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl min-h-[320px]">
      {/* Header with Title, Badges, and Zoom Controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <h2 id="scenario-title" className="text-sm sm:text-base font-semibold text-white">
            {scenario.title}
          </h2>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
              PIPELINED
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700/50 text-slate-400 border border-slate-600/50 uppercase font-medium">
              In-Order
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono-code border border-slate-700/50">
              {totalCycles} Cycles
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1F2430] rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => {
                if (zoomLevel === 'spacious') setZoomLevel('normal');
                else if (zoomLevel === 'normal') setZoomLevel('compact');
              }}
              disabled={zoomLevel === 'compact'}
              title="Zoom Out Matrix"
              aria-label="Zoom Out"
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700/50 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (zoomLevel === 'compact') setZoomLevel('normal');
                else if (zoomLevel === 'normal') setZoomLevel('spacious');
              }}
              disabled={zoomLevel === 'spacious'}
              title="Zoom In Matrix"
              aria-label="Zoom In"
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700/50 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto p-4 sm:p-5 flex-1">
        <table className="w-full text-left font-mono-code border-collapse table-fixed sm:table-auto">
          <thead className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
            <tr>
              <th className={`pb-3 px-2 border-b border-slate-800 ${sizes.instColWidth}`}>
                Instruction
              </th>
              {cycleList.map((c) => {
                const isCurrent = c === currentCycle;
                return (
                  <th
                    key={c}
                    onClick={() => onSelectCycle(c)}
                    title={`Click to jump to Cycle ${c}`}
                    className={`pb-3 px-2 border-b border-l border-slate-800 text-[11px] font-bold text-center cursor-pointer transition-all ${sizes.colWidth} ${
                      isCurrent
                        ? 'border-b-2 border-b-blue-400 bg-blue-500/15 text-blue-300 font-extrabold rounded-t'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    C{c}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono-code">
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group"
              >
                {/* Instruction name column */}
                <td className={`py-3 px-2 text-slate-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis ${sizes.instColWidth}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[10px] select-none font-normal">
                      #{rIdx + 1}
                    </span>
                    <span title={row.instruction}>{row.instruction}</span>
                  </div>
                </td>

                {/* Cycle Stage Cells */}
                {cycleList.map((c) => {
                  const stageInfo = row.stages[c];
                  const isCurrentCycleCol = c === currentCycle;

                  return (
                    <td
                      key={c}
                      onClick={() => onSelectCycle(c)}
                      onMouseEnter={() => {
                        if (stageInfo) {
                          setHoveredCell({
                            instruction: row.instruction,
                            cycle: c,
                            stage: stageInfo.rawText,
                            note: stageInfo.forwardingNote,
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`py-3 px-2 border-l border-slate-800/50 text-center align-middle cursor-pointer transition-colors ${sizes.colWidth} ${
                        isCurrentCycleCol ? 'bg-blue-500/[0.08]' : ''
                      }`}
                    >
                      {renderStageBadge(stageInfo)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Live Hover Info Pill */}
        <div className="mt-4 pt-2 border-t border-slate-800/60 min-h-[28px] flex items-center justify-between text-xs font-mono-code text-slate-400 px-1">
          {hoveredCell ? (
            <div className="flex items-center gap-2 text-slate-200 bg-[#1F2430] px-3 py-1 rounded-lg border border-slate-700/60 shadow-sm">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Cycle {hoveredCell.cycle} • <strong className="text-white">{hoveredCell.instruction}</strong>: {hoveredCell.stage}
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500">
              Interactive Execution Trace: click cycle headers or cells to step through the pipeline.
            </div>
          )}
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Active: <span className="text-blue-400 font-bold">Cycle {currentCycle}</span> / {totalCycles}
          </div>
        </div>
      </div>
    </div>
  );
};
