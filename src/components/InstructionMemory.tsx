import React, { useState } from 'react';
import { Copy, Check, FileCode, PlayCircle } from 'lucide-react';
import { Scenario } from '../types';

interface InstructionMemoryProps {
  scenario: Scenario;
  currentCycle: number;
}

export const InstructionMemory: React.FC<InstructionMemoryProps> = ({
  scenario,
  currentCycle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get current active instruction text in IF / ID / EX
  const currentStageState = scenario.hardwareStagesPerCycle?.[currentCycle];
  const activeIFText = currentStageState?.IF?.instText || '';
  const activeIDText = currentStageState?.ID?.instText || '';
  const activeEXText = currentStageState?.EX?.instText || '';

  // Parse lines with syntax highlighting
  const lines = scenario.code.split('\n');

  const highlightLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return <span>&nbsp;</span>;

    // Check if full comment line
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return <span className="text-slate-500 italic font-mono-code">{trimmed}</span>;
    }

    // Check if label
    if (trimmed.endsWith(':')) {
      return <span className="text-[#f59e0b] font-semibold">{trimmed}</span>;
    }

    // Split inline comment if present
    const commentMatch = line.match(/^([^#]*)(#.*)$/);
    const codePart = commentMatch ? commentMatch[1] : line;
    const commentPart = commentMatch ? commentMatch[2] : '';

    // Split opcode and operands
    const parts = codePart.split(/(\s+|,|\(|\))/);
    return (
      <>
        {parts.map((part, idx) => {
          const lower = part.toLowerCase();
          if (['addi', 'add', 'sub', 'and', 'or', 'xor', 'sll', 'srl', 'sra', 'slt', 'div', 'divu', 'mul', 'mulh', 'rem', 'remu'].includes(lower)) {
            return <span key={idx} className="text-[#3b82f6] font-semibold">{part}</span>;
          }
          if (['lw', 'sw', 'lb', 'sb', 'lh', 'sh'].includes(lower)) {
            return <span key={idx} className="text-[#8b5cf6] font-semibold">{part}</span>;
          }
          if (['beq', 'bne', 'blt', 'bge', 'jal', 'jalr'].includes(lower)) {
            return <span key={idx} className="text-[#ef4444] font-semibold">{part}</span>;
          }
          if (['nop'].includes(lower)) {
            return <span key={idx} className="text-[#8e9192] italic">{part}</span>;
          }
          if (/^x\d+$/i.test(part) || ['sp', 'ra', 'gp', 'tp', 'zero', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 't0', 't1', 't2'].includes(lower)) {
            return <span key={idx} className="text-[#10b981] font-mono-code">{part}</span>;
          }
          if (/^-?\d+$/.test(part) || /^0x[0-9a-f]+$/i.test(part)) {
            return <span key={idx} className="text-[#f59e0b] font-mono-code">{part}</span>;
          }
          return <span key={idx} className="text-[#e2e2e2]">{part}</span>;
        })}
        {commentPart && <span className="text-slate-500 italic ml-1.5">{commentPart}</span>}
      </>
    );
  };

  return (
    <div id="instruction-memory-panel" className="bg-[#161922] border border-slate-800 rounded-xl flex flex-col h-auto max-h-[380px] overflow-hidden shadow-xl">
      {/* File Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Assembly Editor
          </h2>
          <span className="text-[10px] text-slate-500 font-mono-code ml-1">
            instruction_memory.s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono-code hidden sm:inline-block">RISC-V ISA</span>
          <button
            onClick={handleCopy}
            aria-label="Copy Assembly Code"
            title="Copy Assembly Code"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Assembly Viewer */}
      <div className="p-4 font-mono-code text-xs sm:text-sm text-slate-300 overflow-y-auto flex-1 flex select-text bg-[#0a0c11]">
        {/* Line Numbers */}
        <div className="text-slate-600 pr-3.5 select-none text-right border-r border-slate-800/80 mr-3.5 flex flex-col gap-1.5 min-w-[24px]">
          {lines.map((_, idx) => (
            <span key={idx} className="text-[11px] leading-5">
              {idx + 1}
            </span>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-x-auto whitespace-pre">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            const isIF = activeIFText && activeIFText.includes(trimmed) && trimmed.length > 0;
            const isID = activeIDText && activeIDText.includes(trimmed) && trimmed.length > 0;
            const isEX = activeEXText && activeEXText.includes(trimmed) && trimmed.length > 0;

            let rowBg = '';
            let stageBadge = null;

            if (isIF) {
              rowBg = 'bg-blue-500/15 -mx-2 px-2 rounded border-l-2 border-blue-400';
              stageBadge = <span className="text-[9px] font-bold text-blue-400 ml-2 px-1 rounded bg-blue-500/20">IF</span>;
            } else if (isID) {
              rowBg = 'bg-emerald-500/15 -mx-2 px-2 rounded border-l-2 border-emerald-400';
              stageBadge = <span className="text-[9px] font-bold text-emerald-400 ml-2 px-1 rounded bg-emerald-500/20">ID</span>;
            } else if (isEX) {
              rowBg = 'bg-amber-500/15 -mx-2 px-2 rounded border-l-2 border-amber-400';
              stageBadge = <span className="text-[9px] font-bold text-amber-400 ml-2 px-1 rounded bg-amber-500/20">EX</span>;
            }

            return (
              <div
                key={idx}
                className={`flex items-center justify-between transition-colors leading-5 ${rowBg}`}
              >
                <div className="flex items-center">
                  {highlightLine(line)}
                </div>
                {stageBadge}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assembly Footer Status */}
      <div className="px-4 py-2 border-t border-slate-800 bg-[#0F1117] text-[10px] font-mono-code text-slate-500 flex justify-between items-center">
        <span>Encoding: RV32I Base</span>
        <span>{lines.filter(l => l.trim() && !l.trim().endsWith(':')).length} Instructions</span>
      </div>
    </div>
  );
};
