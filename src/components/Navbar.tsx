import React from 'react';
import { Play, Pause, RotateCcw, StepForward, StepBack, Cpu, Bug, Terminal, Activity, Layers } from 'lucide-react';
import { Scenario } from '../types';

interface NavbarProps {
  scenarios: Scenario[];
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentCycle: number;
  maxCycles: number;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  simSpeed: number;
  onChangeSpeed: (speed: number) => void;
  showRegisters: boolean;
  onToggleRegisters: () => void;
  showTerminal: boolean;
  onToggleTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scenarios,
  currentScenario,
  onSelectScenario,
  isPlaying,
  onTogglePlay,
  currentCycle,
  maxCycles,
  onStepForward,
  onStepBack,
  onReset,
  simSpeed,
  onChangeSpeed,
  showRegisters,
  onToggleRegisters,
  showTerminal,
  onToggleTerminal,
}) => {
  return (
    <header
      id="top-navbar"
      className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 bg-[#161922] border-b border-slate-800 shadow-xl sticky top-0 z-50 flex-wrap gap-3"
    >
      {/* Brand & Version Badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
          {/* SVG CPU Microchip Icon */}
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="9" y="9" width="6" height="6" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>RISC-V</span>
              <span className="text-blue-400">Microarchitecture Diagnostic Lab</span>
            </h1>
            <span className="text-[11px] font-mono-code text-slate-500 uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
              RV32I
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            5-Stage In-Order Pipeline • Interactive Cycle Simulator
          </p>
        </div>
      </div>

      {/* Scenario Selector & Controls */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Scenario Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-widest font-semibold text-slate-400 hidden sm:inline-block">
            Pipeline Scenario:
          </label>
          <div className="relative">
            <select
              id="scenario-select"
              aria-label="Pipeline Scenario"
              value={currentScenario.id}
              onChange={(e) => {
                const selected = scenarios.find((s) => s.id === e.target.value);
                if (selected) onSelectScenario(selected);
              }}
              className="bg-[#1F2430] border border-slate-700 text-xs sm:text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block py-1.5 px-3 pr-8 outline-none text-white cursor-pointer hover:bg-slate-700/70 transition-colors font-mono-code appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
              }}
            >
              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id} className="bg-[#161922] text-white">
                  {scenario.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center bg-[#1F2430] border border-slate-700/60 rounded-lg p-0.5 gap-0.5">
          <button
            id="btn-step-back"
            onClick={onStepBack}
            disabled={currentCycle <= 1}
            title="Step Previous Cycle (Left Arrow)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
          >
            <StepBack className="w-3.5 h-3.5" />
          </button>
          
          <button
            id="btn-step-forward"
            onClick={onStepForward}
            disabled={currentCycle >= maxCycles}
            title="Step Next Cycle (Right Arrow)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
          >
            <StepForward className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-reset-sim"
            onClick={onReset}
            title="Reset Simulation to Cycle 1"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="hidden sm:flex items-center bg-[#1F2430] border border-slate-700/60 rounded-lg px-2 py-1 text-[11px] font-mono-code text-slate-400 gap-1.5">
          <span className="text-[10px] uppercase font-semibold">Speed:</span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => onChangeSpeed(spd)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                simSpeed === spd
                  ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
                  : 'hover:text-white text-slate-400'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Auxiliary View Toggles (Registers & Bus Monitor) */}
        <div className="flex items-center gap-1">
          <button
            id="toggle-registers-btn"
            onClick={onToggleRegisters}
            aria-label="Toggle Register File Viewer"
            title="Toggle Register File (RF)"
            className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
              showRegisters
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            id="toggle-terminal-btn"
            onClick={onToggleTerminal}
            aria-label="Toggle Hardware Signals Terminal"
            title="Toggle Hardware Signals Terminal"
            className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
              showTerminal
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Simulation Button */}
        <button
          id="btn-run-simulation"
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 font-medium rounded-lg text-xs md:text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20 font-sans font-semibold cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Simulation</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
