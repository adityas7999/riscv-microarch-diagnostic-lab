import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { Scenario } from '../types';

interface AIDiagnosticCardProps {
  scenario: Scenario;
  onApplyPatch?: (patchId: string) => void;
}

export const AIDiagnosticCard: React.FC<AIDiagnosticCardProps> = ({
  scenario,
  onApplyPatch,
}) => {
  const isResolved = scenario.id === 'forwarding-resolved';

  return (
    <div
      id="ai-diagnostic-card"
      className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5 flex flex-col gap-3 shadow-xl"
    >
      {/* Header with Lightbulb Icon from Design HTML */}
      <h2 className="text-xs uppercase tracking-widest font-bold text-blue-400 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>AI Diagnostic</span>
      </h2>

      {/* Optimization Tag */}
      <div className="flex items-center gap-2 text-xs text-slate-300">
        {isResolved ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        )}
        <span className="font-semibold text-white">
          {isResolved ? 'Optimal Microarchitecture' : 'Hazard Detected'}:
        </span>
        <span className="text-slate-400 truncate">{scenario.title}</span>
      </div>

      {/* AI Diagnostic Text */}
      <p id="diagnostic-text" className="text-xs leading-relaxed text-slate-400 italic bg-[#0F1117]/80 p-3 rounded-lg border border-slate-800/80">
        {scenario.aiDiagnostic}
      </p>

      {/* Patch / Fix Action Button */}
      {scenario.recommendedPatchId && onApplyPatch && (
        <button
          id="btn-apply-patch"
          onClick={() => onApplyPatch(scenario.recommendedPatchId!)}
          className="mt-1 w-full flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 py-2 px-3 rounded-lg transition-all font-mono-code text-xs font-semibold cursor-pointer active:scale-98"
        >
          <span>{scenario.patchLabel || 'Apply Patch & Simulate'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
