export type PipelineStage = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';

export interface CycleTraceEntry {
  cycle: number;
  IF: string;
  ID: string;
  EX: string;
  MEM: string;
  WB: string;
}

export interface StageStateDetail {
  pc?: string;
  instHex?: string;
  instText?: string;
  status: string; // e.g. "Active", "Stalled", "Flushed", "Bubble", "Computing", "Writing Data", "Branch Resolved"
  details?: string; // e.g. "rs1=x0, rd=x1, imm=5" or "ALU: 0 + 5 = 5"
  extraBadge?: string;
}

export interface CycleHardwareState {
  cycle: number;
  IF: StageStateDetail;
  ID: StageStateDetail;
  EX: StageStateDetail;
  MEM: StageStateDetail;
  WB: StageStateDetail;
  registers?: Record<string, number | string>;
  activeForwarding?: string[];
}

export interface InstructionMatrixRow {
  instruction: string;
  stages: Record<number, {
    stage: PipelineStage | 'STALL' | 'FLUSH' | 'FREEZE' | 'NOP' | '-';
    rawText: string;
    hasForwarding?: boolean;
    forwardingNote?: string;
    isStall?: boolean;
    isFlush?: boolean;
  }>;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  code: string;
  cycles: number;
  ipc: number;
  pipelineTrace: CycleTraceEntry[];
  aiDiagnostic: string;
  // Extra rich metadata for microarchitecture analysis
  category?: 'RAW Hazard' | 'Forwarding' | 'Control Hazard' | 'Load-Use Stall' | 'Memory / Cache' | 'Structural Hazard' | 'Loop Optimization' | 'Name Dependencies' | 'Multi-Cycle EX Hazard' | string;
  stalls?: number;
  flushes?: number;
  instructionCount?: number;
  hardwareStagesPerCycle?: Record<number, CycleHardwareState>;
  recommendedPatchId?: string;
  patchLabel?: string;
}
