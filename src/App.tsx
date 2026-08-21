import React, { useState, useEffect, useCallback } from 'react';
import { SCENARIOS } from './data/scenarios';
import { Scenario } from './types';
import { Navbar } from './components/Navbar';
import { InstructionMemory } from './components/InstructionMemory';
import { PipelineLegend } from './components/PipelineLegend';
import { HardwareStageCards } from './components/HardwareStageCards';
import { ExecutionTraceMatrix } from './components/ExecutionTraceMatrix';
import { TelemetryPanel } from './components/TelemetryPanel';
import { AIDiagnosticCard } from './components/AIDiagnosticCard';
import { RegisterFileDrawer } from './components/RegisterFileDrawer';

export default function App() {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);
  const [showRegisters, setShowRegisters] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);

  const maxCycles = currentScenario.pipelineTrace.length || currentScenario.cycles;

  // Reset cycle when scenario changes
  const handleSelectScenario = useCallback((scenario: Scenario) => {
    setCurrentScenario(scenario);
    setCurrentCycle(1);
    setIsPlaying(false);
  }, []);

  // Step Forward
  const handleStepForward = useCallback(() => {
    setCurrentCycle((prev) => (prev < maxCycles ? prev + 1 : prev));
  }, [maxCycles]);

  // Step Back
  const handleStepBack = useCallback(() => {
    setCurrentCycle((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setCurrentCycle(1);
    setIsPlaying(false);
  }, []);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    if (currentCycle >= maxCycles) {
      setCurrentCycle(1);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentCycle, maxCycles]);

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 1200 / simSpeed;
    const timer = setInterval(() => {
      setCurrentCycle((prev) => {
        if (prev >= maxCycles) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, simSpeed, maxCycles]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is interacting with an input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleStepBack();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStepForward, handleStepBack, handleTogglePlay]);

  // Handle Patch Action
  const handleApplyPatch = (patchId: string) => {
    const targetScenario = SCENARIOS.find((s) => s.id === patchId);
    if (targetScenario) {
      handleSelectScenario(targetScenario);
      // Auto run simulation on fix!
      setTimeout(() => {
        setIsPlaying(true);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        scenarios={SCENARIOS}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        currentCycle={currentCycle}
        maxCycles={maxCycles}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        simSpeed={simSpeed}
        onChangeSpeed={setSimSpeed}
        showRegisters={showRegisters}
        onToggleRegisters={() => setShowRegisters((prev) => !prev)}
        showTerminal={showTerminal}
        onToggleTerminal={() => setShowTerminal((prev) => !prev)}
      />

      {/* Main Microarchitecture Diagnostic Dashboard (12-column Sleek Layout) */}
      <main className="max-w-[1720px] mx-auto w-full p-4 lg:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 flex-1">
        {/* Left Column: Code Viewport & Pipeline Legend (col-span-3) */}
        <aside className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col gap-4 lg:gap-6">
          <InstructionMemory
            scenario={currentScenario}
            currentCycle={currentCycle}
          />

          <PipelineLegend
            selectedStageFilter={selectedStageFilter}
            onSelectStageFilter={setSelectedStageFilter}
          />
        </aside>

        {/* Center Column: Hardware Stages & Execution Trace Matrix (col-span-6) */}
        <section className="col-span-1 md:col-span-8 lg:col-span-6 flex flex-col gap-4 lg:gap-6 min-w-0">
          {/* Hardware Stage State Cards */}
          <HardwareStageCards
            scenario={currentScenario}
            currentCycle={currentCycle}
          />

          {/* Dynamic Execution Trace Matrix */}
          <ExecutionTraceMatrix
            scenario={currentScenario}
            currentCycle={currentCycle}
            onSelectCycle={(c) => {
              setCurrentCycle(c);
              setIsPlaying(false);
            }}
            selectedStageFilter={selectedStageFilter}
          />
        </section>

        {/* Right Column: Telemetry & AI Diagnostic (col-span-3) */}
        <aside className="col-span-1 md:col-span-12 lg:col-span-3 flex flex-col gap-4 lg:gap-6">
          <TelemetryPanel
            scenario={currentScenario}
            currentCycle={currentCycle}
            onSelectCycle={(c) => {
              setCurrentCycle(c);
              setIsPlaying(false);
            }}
          />

          <AIDiagnosticCard
            scenario={currentScenario}
            onApplyPatch={handleApplyPatch}
          />
        </aside>
      </main>

      {/* Auxiliary Floating Drawers (RF & Hardware Bus Monitor) */}
      <RegisterFileDrawer
        scenario={currentScenario}
        currentCycle={currentCycle}
        showRegisters={showRegisters}
        onCloseRegisters={() => setShowRegisters(false)}
        showTerminal={showTerminal}
        onCloseTerminal={() => setShowTerminal(false)}
      />
    </div>
  );
}
