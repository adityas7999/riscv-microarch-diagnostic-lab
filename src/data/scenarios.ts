import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: "raw-hazard",
    title: "RAW Data Hazard (Without Forwarding)",
    description: "A Read-After-Write (RAW) data dependency occurs when an instruction depends on the result of a prior instruction that has not yet written back to the register file.",
    code: "ADDI x1, x0, 5\nADD x2, x1, x3",
    cycles: 8,
    ipc: 0.29,
    category: "RAW Hazard",
    stalls: 2,
    flushes: 0,
    instructionCount: 2,
    recommendedPatchId: "forwarding-resolved",
    patchLabel: "Enable Forwarding Paths",
    pipelineTrace: [
      { cycle: 1, IF: "ADDI x1, x0, 5", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADD x2, x1, x3", ID: "ADDI x1, x0, 5", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "stall", ID: "ADD x2, x1, x3", EX: "ADDI x1, x0, 5", MEM: "-", WB: "-" },
      { cycle: 4, IF: "stall", ID: "ADD x2, x1, x3", EX: "NOP", MEM: "ADDI x1, x0, 5", WB: "-" },
      { cycle: 5, IF: "-", ID: "ADD x2, x1, x3", EX: "NOP", MEM: "NOP", WB: "ADDI x1, x0, 5" },
      { cycle: 6, IF: "-", ID: "-", EX: "ADD x2, x1, x3", MEM: "NOP", WB: "NOP" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "ADD x2, x1, x3", WB: "-" },
      { cycle: 8, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "ADD x2, x1, x3" }
    ],
    aiDiagnostic: "The processor incurs a 2-cycle stall because x1 is read in ID before ADDI commits in WB. To resolve this, enable hardware forwarding paths (EX-to-EX / MEM-to-EX) or insert independent instructions to eliminate bubble cycles.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00500093", instText: "ADDI x1, x0, 5", status: "Active", details: "PC: 0x00400000" },
        ID: { status: "Idle", details: "No instruction decoded" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No bus transaction" },
        WB: { status: "Idle", details: "No register writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x00308133", instText: "ADD x2, x1, x3", status: "Active", details: "PC: 0x00400004" },
        ID: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Decoding", details: "rs1=x0 (0), rd=x1, imm=5" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No bus transaction" },
        WB: { status: "Idle", details: "No register writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", status: "Stalled", details: "Hazard unit hold PC" },
        ID: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "RAW Hazard", details: "Wait for x1 writeback (WB)" },
        EX: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Computing", details: "ALU: 0 + 5 = 5 (in EX/MEM)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10 }
      },
      4: {
        cycle: 4,
        IF: { pc: "0x00400008", status: "Stalled", details: "Hazard unit hold PC (cycle 2)" },
        ID: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "RAW Hazard", details: "Wait for x1 in WB stage" },
        EX: { instText: "NOP (Bubble)", status: "Bubble", details: "Control signals zeroed" },
        MEM: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Pass-through", details: "Val: 5 -> MEM/WB reg" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "Pipeline drain" },
        ID: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Decode & Read", details: "Read x1=5 (from WB), x3=10" },
        EX: { instText: "NOP (Bubble)", status: "Bubble", details: "No operation" },
        MEM: { instText: "NOP (Bubble)", status: "Bubble", details: "No operation" },
        WB: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Writeback", details: "Regfile[x1] <= 5" },
        registers: { x0: 0, x1: 5, x2: 0, x3: 10 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Computing", details: "ALU: 5 + 10 = 15" },
        MEM: { instText: "NOP", status: "Bubble", details: "Bubble drain" },
        WB: { instText: "NOP", status: "Bubble", details: "Bubble drain" },
        registers: { x0: 0, x1: 5, x2: 0, x3: 10 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Pass-through", details: "Val: 15 -> MEM/WB reg" },
        WB: { status: "Idle", details: "-" },
        registers: { x0: 0, x1: 5, x2: 0, x3: 10 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Writeback", details: "Regfile[x2] <= 15" },
        registers: { x0: 0, x1: 5, x2: 15, x3: 10 }
      }
    }
  },
  {
    id: "forwarding-resolved",
    title: "Data Forwarding Resolved",
    description: "Hardware forwarding paths bypass the register file, routing ALU results directly from EX/MEM and MEM/WB pipeline registers to dependent execution stages without stalls.",
    code: "ADDI x1, x0, 5\nADD x2, x1, x3\nSUB x4, x2, x5",
    cycles: 7,
    ipc: 0.43,
    category: "Forwarding",
    stalls: 0,
    flushes: 0,
    instructionCount: 3,
    recommendedPatchId: "raw-hazard",
    patchLabel: "Inspect RAW Baseline",
    pipelineTrace: [
      { cycle: 1, IF: "ADDI x1, x0, 5", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADD x2, x1, x3", ID: "ADDI x1, x0, 5", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "SUB x4, x2, x5", ID: "ADD x2, x1, x3", EX: "ADDI x1, x0, 5", MEM: "-", WB: "-" },
      { cycle: 4, IF: "-", ID: "SUB x4, x2, x5", EX: "ADD x2, x1, x3 (fwd x1)", MEM: "ADDI x1, x0, 5", WB: "-" },
      { cycle: 5, IF: "-", ID: "-", EX: "SUB x4, x2, x5 (fwd x2)", MEM: "ADD x2, x1, x3", WB: "ADDI x1, x0, 5" },
      { cycle: 6, IF: "-", ID: "-", EX: "-", MEM: "SUB x4, x2, x5", WB: "ADD x2, x1, x3" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "SUB x4, x2, x5" }
    ],
    aiDiagnostic: "Data forwarding successfully eliminated all RAW stalls. The ALU result of ADDI is forwarded from EX/MEM to EX for ADD, and ADD's result is forwarded to SUB without inserting NOP bubbles.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00500093", instText: "ADDI x1, x0, 5", status: "Active", details: "PC: 0x00400000" },
        ID: { status: "Idle", details: "No instruction decoded" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10, x4: 0, x5: 4 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x00308133", instText: "ADD x2, x1, x3", status: "Active", details: "PC: 0x00400004" },
        ID: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Decoding", details: "rs1=x0 (0), rd=x1, imm=5" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10, x4: 0, x5: 4 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", instHex: "0x40510233", instText: "SUB x4, x2, x5", status: "Active", details: "PC: 0x00400008" },
        ID: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Decoding", details: "rs1=x1 (needs fwd), rs2=x3 (10)" },
        EX: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Computing", details: "ALU: 0 + 5 = 5 (EX/MEM out)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x0: 0, x1: 0, x2: 0, x3: 10, x4: 0, x5: 4 }
      },
      4: {
        cycle: 4,
        IF: { status: "Idle", details: "Fetched all basic block insts" },
        ID: { pc: "0x00400008", instText: "SUB x4, x2, x5", status: "Decoding", details: "rs1=x2 (needs fwd), rs2=x5 (4)" },
        EX: { pc: "0x00400004", instText: "ADD x2, x1, x3 (fwd x1)", status: "Forwarding Active", details: "MuxA <= EX/MEM (5) + 10 = 15", extraBadge: "EX-to-EX Fwd" },
        MEM: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Pass-through", details: "Val: 5 forwarded to ALU" },
        WB: { status: "Idle", details: "No writeback" },
        activeForwarding: ["EX/MEM -> EX (x1 = 5)"],
        registers: { x0: 0, x1: 0, x2: 0, x3: 10, x4: 0, x5: 4 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x00400008", instText: "SUB x4, x2, x5 (fwd x2)", status: "Forwarding Active", details: "MuxA <= EX/MEM (15) - 4 = 11", extraBadge: "EX-to-EX Fwd" },
        MEM: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Pass-through", details: "Val: 15 forwarded to SUB" },
        WB: { pc: "0x00400000", instText: "ADDI x1, x0, 5", status: "Writeback", details: "Regfile[x1] <= 5" },
        activeForwarding: ["EX/MEM -> EX (x2 = 15)"],
        registers: { x0: 0, x1: 5, x2: 0, x3: 10, x4: 0, x5: 4 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x00400008", instText: "SUB x4, x2, x5", status: "Pass-through", details: "Val: 11 -> MEM/WB" },
        WB: { pc: "0x00400004", instText: "ADD x2, x1, x3", status: "Writeback", details: "Regfile[x2] <= 15" },
        registers: { x0: 0, x1: 5, x2: 15, x3: 10, x4: 0, x5: 4 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x00400008", instText: "SUB x4, x2, x5", status: "Writeback", details: "Regfile[x4] <= 11" },
        registers: { x0: 0, x1: 5, x2: 15, x3: 10, x4: 11, x5: 4 }
      }
    }
  },
  {
    id: "branch-mispredict",
    title: "Branch Misprediction (Control Hazard)",
    description: "A conditional branch is resolved in the EX stage. Because the branch is taken, speculative instructions fetched in IF and ID are flushed (converted into bubbles).",
    code: "BEQ x1, x2, target\nADDI x3, x0, 1\nADDI x4, x0, 2\ntarget:\nADD x5, x6, x7",
    cycles: 8,
    ipc: 0.25,
    category: "Control Hazard",
    stalls: 0,
    flushes: 2,
    instructionCount: 2,
    recommendedPatchId: "forwarding-resolved",
    patchLabel: "Add Branch Predictor",
    pipelineTrace: [
      { cycle: 1, IF: "BEQ x1, x2, target", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADDI x3, x0, 1", ID: "BEQ x1, x2, target", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "ADDI x4, x0, 2", ID: "ADDI x3, x0, 1", EX: "BEQ (Taken)", MEM: "-", WB: "-" },
      { cycle: 4, IF: "ADD x5, x6, x7", ID: "FLUSH (NOP)", EX: "FLUSH (NOP)", MEM: "BEQ x1, x2, target", WB: "-" },
      { cycle: 5, IF: "-", ID: "ADD x5, x6, x7", EX: "NOP", MEM: "NOP", WB: "BEQ x1, x2, target" },
      { cycle: 6, IF: "-", ID: "-", EX: "ADD x5, x6, x7", MEM: "NOP", WB: "NOP" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "ADD x5, x6, x7", WB: "NOP" },
      { cycle: 8, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "ADD x5, x6, x7" }
    ],
    aiDiagnostic: "A 2-cycle branch penalty occurs due to target calculation and branch condition evaluation in the EX stage. Implementing dynamic branch prediction (BHT/2-bit saturating counter) and resolving branches in the ID stage will minimize flush penalties.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00208463", instText: "BEQ x1, x2, target", status: "Active", details: "PC: 0x00400000" },
        ID: { status: "Idle", details: "No decode" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x00100193", instText: "ADDI x3, x0, 1", status: "Speculative Fetch", details: "PC+4 (Predicted Not-Taken)" },
        ID: { pc: "0x00400000", instText: "BEQ x1, x2, target", status: "Decoding", details: "rs1=x1 (5), rs2=x2 (5), imm=12" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", instHex: "0x00200213", instText: "ADDI x4, x0, 2", status: "Speculative Fetch", details: "PC+8 (Predicted Not-Taken)" },
        ID: { pc: "0x00400004", instText: "ADDI x3, x0, 1", status: "Decoding", details: "rs1=x0 (0), rd=x3, imm=1" },
        EX: { pc: "0x00400000", instText: "BEQ (Taken)", status: "Branch Evaluated", details: "5 == 5 -> TAKEN! Target: 0x0040000C", extraBadge: "Mispredict!" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      4: {
        cycle: 4,
        IF: { pc: "0x0040000C", instHex: "0x007302B3", instText: "ADD x5, x6, x7", status: "Branch Target Fetch", details: "Redirect PC to target" },
        ID: { instText: "FLUSH (NOP)", status: "Flushed", details: "ADDI x3 squashed (Bubble)" },
        EX: { instText: "FLUSH (NOP)", status: "Flushed", details: "ADDI x4 squashed (Bubble)" },
        MEM: { pc: "0x00400000", instText: "BEQ x1, x2, target", status: "Branch Committed", details: "Branch taken resolved" },
        WB: { status: "Idle", details: "No writeback for branch" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "Program complete" },
        ID: { pc: "0x0040000C", instText: "ADD x5, x6, x7", status: "Decoding", details: "rs1=x6 (12), rs2=x7 (8), rd=x5" },
        EX: { instText: "NOP (Bubble)", status: "Bubble", details: "Flushed slot drain" },
        MEM: { instText: "NOP (Bubble)", status: "Bubble", details: "Flushed slot drain" },
        WB: { pc: "0x00400000", instText: "BEQ x1, x2, target", status: "Retired", details: "Branch retired" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x0040000C", instText: "ADD x5, x6, x7", status: "Computing", details: "ALU: 12 + 8 = 20" },
        MEM: { instText: "NOP", status: "Bubble", details: "-" },
        WB: { instText: "NOP", status: "Bubble", details: "-" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x0040000C", instText: "ADD x5, x6, x7", status: "Pass-through", details: "Val: 20 -> MEM/WB" },
        WB: { instText: "NOP", status: "Bubble", details: "-" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 0, x6: 12, x7: 8 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x0040000C", instText: "ADD x5, x6, x7", status: "Writeback", details: "Regfile[x5] <= 20" },
        registers: { x1: 5, x2: 5, x3: 0, x4: 0, x5: 20, x6: 12, x7: 8 }
      }
    }
  },
  {
    id: "load-use-stall",
    title: "Load-Use Delay Stall",
    description: "A Load-Use hazard occurs when an instruction immediately depends on data loaded from memory by an adjacent preceding load instruction, requiring a mandatory 1-cycle stall even with forwarding.",
    code: "LW x1, 0(x2)\nADD x3, x1, x4",
    cycles: 7,
    ipc: 0.29,
    category: "Load-Use Stall",
    stalls: 1,
    flushes: 0,
    instructionCount: 2,
    recommendedPatchId: "forwarding-resolved",
    patchLabel: "Instruction Scheduling Fix",
    pipelineTrace: [
      { cycle: 1, IF: "LW x1, 0(x2)", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADD x3, x1, x4", ID: "LW x1, 0(x2)", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "stall", ID: "ADD x3, x1, x4", EX: "LW x1, 0(x2)", MEM: "-", WB: "-" },
      { cycle: 4, IF: "-", ID: "ADD x3, x1, x4", EX: "NOP (Stall Bubble)", MEM: "LW x1, 0(x2)", WB: "-" },
      { cycle: 5, IF: "-", ID: "-", EX: "ADD x3, x1, x4 (fwd x1)", MEM: "NOP", WB: "LW x1, 0(x2)" },
      { cycle: 6, IF: "-", ID: "-", EX: "-", MEM: "ADD x3, x1, x4", WB: "NOP" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "ADD x3, x1, x4" }
    ],
    aiDiagnostic: "Load data is only ready at the end of the MEM stage, requiring 1 bubble before EX can consume it. Reorder independent instructions between the load and the dependent ALU instruction via compiler instruction scheduling to hide load latency.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00012083", instText: "LW x1, 0(x2)", status: "Active", details: "PC: 0x00400000" },
        ID: { status: "Idle", details: "No instruction decoded" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFFF00", x3: 0, x4: 7 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x004081B3", instText: "ADD x3, x1, x4", status: "Active", details: "PC: 0x00400004" },
        ID: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Decoding", details: "rs1=x2 (0x7FFFFF00), rd=x1, imm=0" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFFF00", x3: 0, x4: 7 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", status: "Stalled", details: "Hazard unit hold PC" },
        ID: { pc: "0x00400004", instText: "ADD x3, x1, x4", status: "Load-Use Hazard", details: "Depends on LW rd=x1 (Mem Read Pending)", extraBadge: "Load-Use Stall" },
        EX: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Addr Gen", details: "ALU: 0x7FFFFF00 + 0 = 0x7FFFFF00" },
        MEM: { status: "Idle", details: "No memory access yet" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFFF00", x3: 0, x4: 7 }
      },
      4: {
        cycle: 4,
        IF: { status: "Idle", details: "Hold" },
        ID: { pc: "0x00400004", instText: "ADD x3, x1, x4", status: "Decode Hold", details: "Wait for MEM stage to complete" },
        EX: { instText: "NOP (Stall Bubble)", status: "Bubble Inserted", details: "Control signals zeroed" },
        MEM: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "D-Cache Read", details: "Read [0x7FFFFF00] -> Data: 42 (Ready in MEM/WB)" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFFF00", x3: 0, x4: 7 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x00400004", instText: "ADD x3, x1, x4 (fwd x1)", status: "Forwarding Active", details: "MuxA <= MEM/WB (42) + x4 (7) = 49", extraBadge: "MEM-to-EX Fwd" },
        MEM: { instText: "NOP", status: "Bubble", details: "-" },
        WB: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Writeback", details: "Regfile[x1] <= 42" },
        activeForwarding: ["MEM/WB -> EX (x1 = 42)"],
        registers: { x1: 42, x2: "0x7FFFFF00", x3: 0, x4: 7 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x00400004", instText: "ADD x3, x1, x4", status: "Pass-through", details: "Val: 49 -> MEM/WB" },
        WB: { instText: "NOP", status: "Bubble", details: "-" },
        registers: { x1: 42, x2: "0x7FFFFF00", x3: 0, x4: 7 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x00400004", instText: "ADD x3, x1, x4", status: "Writeback", details: "Regfile[x3] <= 49" },
        registers: { x1: 42, x2: "0x7FFFFF00", x3: 49, x4: 7 }
      }
    }
  },
  {
    id: "cache-miss-penalty",
    title: "Cache Miss Penalty",
    description: "A data cache miss in the MEM stage halts the pipeline while the requested cache line is fetched from higher-latency memory tiers (L2/DRAM).",
    code: "LW x1, 0(x2)\nADD x3, x4, x5",
    cycles: 9,
    ipc: 0.22,
    category: "Memory / Cache",
    stalls: 3,
    flushes: 0,
    instructionCount: 2,
    recommendedPatchId: "forwarding-resolved",
    patchLabel: "Simulate Non-Blocking Cache",
    pipelineTrace: [
      { cycle: 1, IF: "LW x1, 0(x2)", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADD x3, x4, x5", ID: "LW x1, 0(x2)", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "-", ID: "ADD x3, x4, x5", EX: "LW x1, 0(x2)", MEM: "-", WB: "-" },
      { cycle: 4, IF: "freeze", ID: "ADD x3, x4, x5 (Freeze)", EX: "Freeze", MEM: "LW x1, 0(x2) [D$ Miss]", WB: "-" },
      { cycle: 5, IF: "freeze", ID: "ADD x3, x4, x5 (Freeze)", EX: "Freeze", MEM: "LW x1, 0(x2) [Wait DRAM]", WB: "-" },
      { cycle: 6, IF: "freeze", ID: "ADD x3, x4, x5 (Freeze)", EX: "Freeze", MEM: "LW x1, 0(x2) [Data Ready]", WB: "-" },
      { cycle: 7, IF: "-", ID: "-", EX: "ADD x3, x4, x5", MEM: "NOP", WB: "LW x1, 0(x2)" },
      { cycle: 8, IF: "-", ID: "-", EX: "-", MEM: "ADD x3, x4, x5", WB: "NOP" },
      { cycle: 9, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "ADD x3, x4, x5" }
    ],
    aiDiagnostic: "A 3-cycle D-cache miss stalls all upstream pipeline stages (IF, ID, EX). Mitigate this penalty using hardware prefetchers, non-blocking cache architectures (hit-under-miss), and loop tiling/cache-aware data layout optimizations.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00012083", instText: "LW x1, 0(x2)", status: "Active", details: "PC: 0x00400000" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { status: "Idle", details: "-" },
        registers: { x1: 0, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x005201B3", instText: "ADD x3, x4, x5", status: "Active", details: "PC: 0x00400004" },
        ID: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Decoding", details: "rs1=x2 (0x80004000), rd=x1, imm=0" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { status: "Idle", details: "-" },
        registers: { x1: 0, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      3: {
        cycle: 3,
        IF: { status: "Idle", details: "-" },
        ID: { pc: "0x00400004", instText: "ADD x3, x4, x5", status: "Decoding", details: "rs1=x4 (15), rs2=x5 (25), rd=x3" },
        EX: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Addr Gen", details: "ALU: 0x80004000 + 0 = 0x80004000" },
        MEM: { status: "Idle", details: "-" },
        WB: { status: "Idle", details: "-" },
        registers: { x1: 0, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      4: {
        cycle: 4,
        IF: { status: "Frozen", details: "Pipeline freeze signal asserted" },
        ID: { status: "Frozen", details: "Hold ADD in ID register" },
        EX: { status: "Frozen", details: "Hold ALU state" },
        MEM: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "D$ Miss", details: "Tag mismatch at 0x80004000 -> DRAM Request", extraBadge: "L1 Cache Miss" },
        WB: { status: "Idle", details: "-" },
        registers: { x1: 0, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      5: {
        cycle: 5,
        IF: { status: "Frozen", details: "Pipeline freeze (cycle 2)" },
        ID: { status: "Frozen", details: "Pipeline freeze" },
        EX: { status: "Frozen", details: "Pipeline freeze" },
        MEM: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Wait DRAM", details: "Bus transaction in flight (Latency: 2/3)" },
        WB: { status: "Idle", details: "-" },
        registers: { x1: 0, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      6: {
        cycle: 6,
        IF: { status: "Frozen", details: "Pipeline freeze (cycle 3)" },
        ID: { status: "Frozen", details: "Pipeline freeze" },
        EX: { status: "Frozen", details: "Pipeline freeze" },
        MEM: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Data Ready", details: "Cache line refilled! Data: 99", extraBadge: "Line Refilled" },
        WB: { status: "Idle", details: "-" },
        registers: { x1: 0, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x00400004", instText: "ADD x3, x4, x5", status: "Computing", details: "ALU: 15 + 25 = 40" },
        MEM: { instText: "NOP", status: "Bubble", details: "-" },
        WB: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Writeback", details: "Regfile[x1] <= 99" },
        registers: { x1: 99, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x00400004", instText: "ADD x3, x4, x5", status: "Pass-through", details: "Val: 40 -> MEM/WB" },
        WB: { instText: "NOP", status: "Bubble", details: "-" },
        registers: { x1: 99, x2: "0x80004000", x3: 0, x4: 15, x5: 25 }
      },
      9: {
        cycle: 9,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x00400004", instText: "ADD x3, x4, x5", status: "Writeback", details: "Regfile[x3] <= 40" },
        registers: { x1: 99, x2: "0x80004000", x3: 40, x4: 15, x5: 25 }
      }
    }
  },
  {
    id: "structural-hazard",
    title: "Structural Hazard (Unified Memory Bus Conflict)",
    description: "In a unified single-port memory architecture without separate I-Cache and D-Cache, an instruction fetch in IF conflicts with a data load in MEM during the same clock cycle, causing a mandatory 1-cycle fetch stall.",
    code: "LW x1, 0(x2)\nADDI x3, x0, 10\nSUB x4, x5, x6",
    cycles: 8,
    ipc: 0.38,
    category: "Structural Hazard",
    stalls: 1,
    flushes: 0,
    instructionCount: 3,
    recommendedPatchId: "forwarding-resolved",
    patchLabel: "Switch to Harvard Architecture (Split I/D Cache)",
    pipelineTrace: [
      { cycle: 1, IF: "LW x1, 0(x2)", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADDI x3, x0, 10", ID: "LW x1, 0(x2)", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "stall", ID: "ADDI x3, x0, 10", EX: "LW x1, 0(x2)", MEM: "-", WB: "-" },
      { cycle: 4, IF: "SUB x4, x5, x6", ID: "stall", EX: "ADDI x3, x0, 10", MEM: "LW x1, 0(x2) [Mem Read]", WB: "-" },
      { cycle: 5, IF: "-", ID: "SUB x4, x5, x6", EX: "ADDI x3, x0, 10", MEM: "NOP", WB: "LW x1, 0(x2)" },
      { cycle: 6, IF: "-", ID: "-", EX: "SUB x4, x5, x6", MEM: "ADDI x3, x0, 10", WB: "NOP" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "SUB x4, x5, x6", WB: "ADDI x3, x0, 10" },
      { cycle: 8, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "SUB x4, x5, x6" }
    ],
    aiDiagnostic: "A structural memory hazard occurs at Cycle 4: the single-port unified memory bus cannot service simultaneous instruction fetch (IF: SUB) and data load (MEM: LW). The hazard detection unit forces a 1-cycle IF stall. Modern RISC-V cores resolve this by adopting Harvard architecture with split L1 I-Cache and D-Cache or dual-ported SRAM blocks.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00012083", instText: "LW x1, 0(x2)", status: "Active", details: "PC: 0x00400000 (Fetch Load)" },
        ID: { status: "Idle", details: "No decode" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "Mem bus idle" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFF000", x3: 0, x4: 0, x5: 35, x6: 12 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x00A00193", instText: "ADDI x3, x0, 10", status: "Active", details: "PC: 0x00400004 (Fetch ADDI)" },
        ID: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Decoding", details: "rs1=x2 (0x7FFFF000), rd=x1, imm=0" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "Mem bus idle" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFF000", x3: 0, x4: 0, x5: 35, x6: 12 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", status: "Stalled", details: "Memory port occupied by MEM stage next cycle", extraBadge: "Bus Conflict Stall" },
        ID: { pc: "0x00400004", instText: "ADDI x3, x0, 10", status: "Decoding", details: "rs1=x0 (0), rd=x3, imm=10" },
        EX: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Addr Gen", details: "ALU: 0x7FFFF000 + 0 = 0x7FFFF000" },
        MEM: { status: "Idle", details: "Preparing data bus access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFF000", x3: 0, x4: 0, x5: 35, x6: 12 }
      },
      4: {
        cycle: 4,
        IF: { pc: "0x00400008", instHex: "0x40628233", instText: "SUB x4, x5, x6", status: "Active", details: "PC: 0x00400008 (Delayed Fetch)" },
        ID: { instText: "NOP (Stall Bubble)", status: "Stalled", details: "Hold ADDI in pipeline" },
        EX: { pc: "0x00400004", instText: "ADDI x3, x0, 10", status: "Computing", details: "ALU: 0 + 10 = 10" },
        MEM: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Data Access", details: "Single-port RAM read at [0x7FFFF000] -> Data: 84", extraBadge: "Single-Port Mem" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: "0x7FFFF000", x3: 0, x4: 0, x5: 35, x6: 12 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "End of stream" },
        ID: { pc: "0x00400008", instText: "SUB x4, x5, x6", status: "Decoding", details: "rs1=x5 (35), rs2=x6 (12), rd=x4" },
        EX: { instText: "NOP", status: "Bubble", details: "Bubble passing EX" },
        MEM: { pc: "0x00400004", instText: "ADDI x3, x0, 10", status: "Pass-through", details: "Val: 10 -> MEM/WB" },
        WB: { pc: "0x00400000", instText: "LW x1, 0(x2)", status: "Writeback", details: "Regfile[x1] <= 84" },
        registers: { x1: 84, x2: "0x7FFFF000", x3: 0, x4: 0, x5: 35, x6: 12 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x00400008", instText: "SUB x4, x5, x6", status: "Computing", details: "ALU: 35 - 12 = 23" },
        MEM: { instText: "NOP", status: "Bubble", details: "-" },
        WB: { pc: "0x00400004", instText: "ADDI x3, x0, 10", status: "Writeback", details: "Regfile[x3] <= 10" },
        registers: { x1: 84, x2: "0x7FFFF000", x3: 10, x4: 0, x5: 35, x6: 12 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x00400008", instText: "SUB x4, x5, x6", status: "Pass-through", details: "Val: 23 -> MEM/WB" },
        WB: { instText: "NOP", status: "Bubble", details: "-" },
        registers: { x1: 84, x2: "0x7FFFF000", x3: 10, x4: 0, x5: 35, x6: 12 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x00400008", instText: "SUB x4, x5, x6", status: "Writeback", details: "Regfile[x4] <= 23" },
        registers: { x1: 84, x2: "0x7FFFF000", x3: 10, x4: 23, x5: 35, x6: 12 }
      }
    }
  },
  {
    id: "loop-unrolling",
    title: "Loop Unrolling Optimization (4x Counter)",
    description: "Demonstrates high-throughput loop unrolling: replacing loop branch instructions (BNE) and loop counters with sequential unrolled arithmetic to eliminate control hazard flushes and achieve maximum IPC.",
    code: "ADD x2, x2, x10\nADD x2, x2, x11\nADD x2, x2, x12\nADD x2, x2, x13",
    cycles: 8,
    ipc: 0.50,
    category: "Loop Optimization",
    stalls: 0,
    flushes: 0,
    instructionCount: 4,
    recommendedPatchId: "branch-mispredict",
    patchLabel: "Compare with Rolled Branch Loop",
    pipelineTrace: [
      { cycle: 1, IF: "ADD x2, x2, x10", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADD x2, x2, x11", ID: "ADD x2, x2, x10", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "ADD x2, x2, x12", ID: "ADD x2, x2, x11", EX: "ADD x2, x2, x10", MEM: "-", WB: "-" },
      { cycle: 4, IF: "ADD x2, x2, x13", ID: "ADD x2, x2, x12", EX: "ADD x2, x2, x11 (fwd x2)", MEM: "ADD x2, x2, x10", WB: "-" },
      { cycle: 5, IF: "-", ID: "ADD x2, x2, x13", EX: "ADD x2, x2, x12 (fwd x2)", MEM: "ADD x2, x2, x11", WB: "ADD x2, x2, x10" },
      { cycle: 6, IF: "-", ID: "-", EX: "ADD x2, x2, x13 (fwd x2)", MEM: "ADD x2, x2, x12", WB: "ADD x2, x2, x11" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "ADD x2, x2, x13", WB: "ADD x2, x2, x12" },
      { cycle: 8, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "ADD x2, x2, x13" }
    ],
    aiDiagnostic: "Loop unrolling eliminated 4 conditional branch checks (BNE) and 4 counter decrements. With EX-to-EX operand forwarding continuously routing updated accumulator values (x2), the unrolled block achieves near-ideal execution efficiency (0.50 IPC) without branch misprediction penalties.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x00A10133", instText: "ADD x2, x2, x10", status: "Active", details: "PC: 0x00400000 (Iter 1 Fetch)" },
        ID: { status: "Idle", details: "No decode" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x2: 0, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x00B10133", instText: "ADD x2, x2, x11", status: "Active", details: "PC: 0x00400004 (Iter 2 Fetch)" },
        ID: { pc: "0x00400000", instText: "ADD x2, x2, x10", status: "Decoding", details: "rs1=x2 (0), rs2=x10 (10), rd=x2" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x2: 0, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", instHex: "0x00C10133", instText: "ADD x2, x2, x12", status: "Active", details: "PC: 0x00400008 (Iter 3 Fetch)" },
        ID: { pc: "0x00400004", instText: "ADD x2, x2, x11", status: "Decoding", details: "rs1=x2 (needs fwd), rs2=x11 (20), rd=x2" },
        EX: { pc: "0x00400000", instText: "ADD x2, x2, x10", status: "Computing", details: "ALU: 0 + 10 = 10 (Accumulator)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x2: 0, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      4: {
        cycle: 4,
        IF: { pc: "0x0040000C", instHex: "0x00D10133", instText: "ADD x2, x2, x13", status: "Active", details: "PC: 0x0040000C (Iter 4 Fetch)" },
        ID: { pc: "0x00400008", instText: "ADD x2, x2, x12", status: "Decoding", details: "rs1=x2 (needs fwd), rs2=x12 (30), rd=x2" },
        EX: { pc: "0x00400004", instText: "ADD x2, x2, x11 (fwd x2)", status: "Forwarding Active", details: "MuxA <= EX/MEM (10) + 20 = 30", extraBadge: "EX-to-EX Fwd" },
        MEM: { pc: "0x00400000", instText: "ADD x2, x2, x10", status: "Pass-through", details: "Val: 10 forwarded to EX" },
        WB: { status: "Idle", details: "No writeback" },
        activeForwarding: ["EX/MEM -> EX (x2 = 10)"],
        registers: { x2: 0, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "Unrolled loop body complete" },
        ID: { pc: "0x0040000C", instText: "ADD x2, x2, x13", status: "Decoding", details: "rs1=x2 (needs fwd), rs2=x13 (40), rd=x2" },
        EX: { pc: "0x00400008", instText: "ADD x2, x2, x12 (fwd x2)", status: "Forwarding Active", details: "MuxA <= EX/MEM (30) + 30 = 60", extraBadge: "EX-to-EX Fwd" },
        MEM: { pc: "0x00400004", instText: "ADD x2, x2, x11", status: "Pass-through", details: "Val: 30 forwarded to EX" },
        WB: { pc: "0x00400000", instText: "ADD x2, x2, x10", status: "Writeback", details: "Regfile[x2] <= 10 (Iter 1 Commit)" },
        activeForwarding: ["EX/MEM -> EX (x2 = 30)"],
        registers: { x2: 10, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x0040000C", instText: "ADD x2, x2, x13 (fwd x2)", status: "Forwarding Active", details: "MuxA <= EX/MEM (60) + 40 = 100", extraBadge: "EX-to-EX Fwd" },
        MEM: { pc: "0x00400008", instText: "ADD x2, x2, x12", status: "Pass-through", details: "Val: 60 forwarded to EX" },
        WB: { pc: "0x00400004", instText: "ADD x2, x2, x11", status: "Writeback", details: "Regfile[x2] <= 30 (Iter 2 Commit)" },
        activeForwarding: ["EX/MEM -> EX (x2 = 60)"],
        registers: { x2: 30, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x0040000C", instText: "ADD x2, x2, x13", status: "Pass-through", details: "Val: 100 -> MEM/WB" },
        WB: { pc: "0x00400008", instText: "ADD x2, x2, x12", status: "Writeback", details: "Regfile[x2] <= 60 (Iter 3 Commit)" },
        registers: { x2: 60, x10: 10, x11: 20, x12: 30, x13: 40 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x0040000C", instText: "ADD x2, x2, x13", status: "Writeback", details: "Regfile[x2] <= 100 (Final Sum)" },
        registers: { x2: 100, x10: 10, x11: 20, x12: 30, x13: 40 }
      }
    }
  },
  {
    id: "waw-war-dependency",
    title: "WAW / WAR False Dependencies (Name Hazards)",
    description: "Analyzes Write-After-Write (WAW) and Write-After-Read (WAR) name dependencies. Classic 5-stage in-order pipelines handle these hazards transparently without stalls because all reads occur in ID and all writes commit in WB.",
    code: "ADD x1, x2, x3\nSUB x4, x1, x5\nMUL x1, x6, x7\nAND x8, x1, x9",
    cycles: 8,
    ipc: 0.50,
    category: "Name Dependencies",
    stalls: 0,
    flushes: 0,
    instructionCount: 4,
    recommendedPatchId: "raw-hazard",
    patchLabel: "Inspect True RAW Dependency",
    pipelineTrace: [
      { cycle: 1, IF: "ADD x1, x2, x3", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "SUB x4, x1, x5", ID: "ADD x1, x2, x3", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "MUL x1, x6, x7", ID: "SUB x4, x1, x5", EX: "ADD x1, x2, x3", MEM: "-", WB: "-" },
      { cycle: 4, IF: "AND x8, x1, x9", ID: "MUL x1, x6, x7", EX: "SUB x4, x1, x5 (fwd x1)", MEM: "ADD x1, x2, x3", WB: "-" },
      { cycle: 5, IF: "-", ID: "AND x8, x1, x9", EX: "MUL x1, x6, x7", MEM: "SUB x4, x1, x5", WB: "ADD x1, x2, x3" },
      { cycle: 6, IF: "-", ID: "-", EX: "AND x8, x1, x9 (fwd x1)", MEM: "MUL x1, x6, x7", WB: "SUB x4, x1, x5" },
      { cycle: 7, IF: "-", ID: "-", EX: "-", MEM: "AND x8, x1, x9", WB: "MUL x1, x6, x7" },
      { cycle: 8, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "AND x8, x1, x9" }
    ],
    aiDiagnostic: "In this in-order 5-stage pipeline, WAW (inst 1 & 3 both write x1) and WAR (inst 2 reads x1 before inst 3 overwrites it) hazards cause 0 stalls because instructions commit strictly in program order in WB. In Out-of-Order (OoO) superscalar cores, register renaming (mapping architectural x1 to separate physical registers p12 and p18) is required to eliminate false dependency stalls.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x003100B3", instText: "ADD x1, x2, x3", status: "Active", details: "PC: 0x00400000 (Fetch ADD)" },
        ID: { status: "Idle", details: "No decode" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: 5, x3: 10, x4: 0, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x40508233", instText: "SUB x4, x1, x5", status: "Active", details: "PC: 0x00400004 (Fetch SUB)" },
        ID: { pc: "0x00400000", instText: "ADD x1, x2, x3", status: "Decoding", details: "rs1=x2 (5), rs2=x3 (10), rd=x1" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: 5, x3: 10, x4: 0, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", instHex: "0x027300B3", instText: "MUL x1, x6, x7", status: "Active", details: "PC: 0x00400008 (Fetch MUL, WAW on x1)" },
        ID: { pc: "0x00400004", instText: "SUB x4, x1, x5", status: "Decoding", details: "rs1=x1 (needs fwd), rs2=x5 (4), rd=x4" },
        EX: { pc: "0x00400000", instText: "ADD x1, x2, x3", status: "Computing", details: "ALU: 5 + 10 = 15 (First x1 value)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 0, x2: 5, x3: 10, x4: 0, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      4: {
        cycle: 4,
        IF: { pc: "0x0040000C", instHex: "0x0090F433", instText: "AND x8, x1, x9", status: "Active", details: "PC: 0x0040000C (Fetch AND, RAW with MUL)" },
        ID: { pc: "0x00400008", instText: "MUL x1, x6, x7", status: "Decoding", details: "rs1=x6 (6), rs2=x7 (8), rd=x1 (WAW target)" },
        EX: { pc: "0x00400004", instText: "SUB x4, x1, x5 (fwd x1)", status: "Forwarding Active", details: "MuxA <= EX/MEM (15) - 4 = 11", extraBadge: "WAR Resolved Safe" },
        MEM: { pc: "0x00400000", instText: "ADD x1, x2, x3", status: "Pass-through", details: "Val: 15 forwarded to SUB" },
        WB: { status: "Idle", details: "No writeback" },
        activeForwarding: ["EX/MEM -> EX (x1 = 15)"],
        registers: { x1: 0, x2: 5, x3: 10, x4: 0, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      5: {
        cycle: 5,
        IF: { status: "Idle", details: "Instruction stream fetched" },
        ID: { pc: "0x0040000C", instText: "AND x8, x1, x9", status: "Decoding", details: "rs1=x1 (needs fwd from MUL), rs2=x9 (2), rd=x8" },
        EX: { pc: "0x00400008", instText: "MUL x1, x6, x7", status: "Computing", details: "Multiplier: 6 * 8 = 48 (Overwrites x1 in EX)" },
        MEM: { pc: "0x00400004", instText: "SUB x4, x1, x5", status: "Pass-through", details: "Val: 11 -> MEM/WB" },
        WB: { pc: "0x00400000", instText: "ADD x1, x2, x3", status: "Writeback", details: "Regfile[x1] <= 15 (Inst 1 commits)" },
        registers: { x1: 15, x2: 5, x3: 10, x4: 0, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      6: {
        cycle: 6,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x0040000C", instText: "AND x8, x1, x9 (fwd x1)", status: "Forwarding Active", details: "MuxA <= EX/MEM (48) & 2 = 0", extraBadge: "WAW In-Order Commit" },
        MEM: { pc: "0x00400008", instText: "MUL x1, x6, x7", status: "Pass-through", details: "Val: 48 forwarded to AND" },
        WB: { pc: "0x00400004", instText: "SUB x4, x1, x5", status: "Writeback", details: "Regfile[x4] <= 11" },
        activeForwarding: ["EX/MEM -> EX (x1 = 48)"],
        registers: { x1: 15, x2: 5, x3: 10, x4: 11, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x0040000C", instText: "AND x8, x1, x9", status: "Pass-through", details: "Val: 0 -> MEM/WB" },
        WB: { pc: "0x00400008", instText: "MUL x1, x6, x7", status: "Writeback", details: "Regfile[x1] <= 48 (Inst 3 commits, overwriting x1)" },
        registers: { x1: 48, x2: 5, x3: 10, x4: 11, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x0040000C", instText: "AND x8, x1, x9", status: "Writeback", details: "Regfile[x8] <= 0" },
        registers: { x1: 48, x2: 5, x3: 10, x4: 11, x5: 4, x6: 6, x7: 8, x8: 0, x9: 2 }
      }
    }
  },
  {
    id: "multicycle-ex-stall",
    title: "Multi-Cycle EX Stall (Iterative Integer Division)",
    description: "An unpipelined multi-cycle execution functional unit (such as a 4-cycle radix-2 integer divider) stalls upstream pipeline stages (IF and ID) while the EX unit computes the quotient.",
    code: "DIV x3, x1, x2\nADD x4, x5, x6\nSUB x7, x8, x9",
    cycles: 10,
    ipc: 0.30,
    category: "Multi-Cycle EX Hazard",
    stalls: 3,
    flushes: 0,
    instructionCount: 3,
    recommendedPatchId: "forwarding-resolved",
    patchLabel: "Simulate Fully Pipelined ALU",
    pipelineTrace: [
      { cycle: 1, IF: "DIV x3, x1, x2", ID: "-", EX: "-", MEM: "-", WB: "-" },
      { cycle: 2, IF: "ADD x4, x5, x6", ID: "DIV x3, x1, x2", EX: "-", MEM: "-", WB: "-" },
      { cycle: 3, IF: "SUB x7, x8, x9", ID: "ADD x4, x5, x6", EX: "DIV x3, x1, x2 [Iter 1/4]", MEM: "-", WB: "-" },
      { cycle: 4, IF: "stall", ID: "ADD x4, x5, x6 (Hold)", EX: "DIV x3, x1, x2 [Iter 2/4]", MEM: "-", WB: "-" },
      { cycle: 5, IF: "stall", ID: "ADD x4, x5, x6 (Hold)", EX: "DIV x3, x1, x2 [Iter 3/4]", MEM: "-", WB: "-" },
      { cycle: 6, IF: "stall", ID: "ADD x4, x5, x6 (Hold)", EX: "DIV x3, x1, x2 [Iter 4/4]", MEM: "-", WB: "-" },
      { cycle: 7, IF: "-", ID: "SUB x7, x8, x9", EX: "ADD x4, x5, x6", MEM: "DIV x3, x1, x2", WB: "-" },
      { cycle: 8, IF: "-", ID: "-", EX: "SUB x7, x8, x9", MEM: "ADD x4, x5, x6", WB: "DIV x3, x1, x2" },
      { cycle: 9, IF: "-", ID: "-", EX: "-", MEM: "SUB x7, x8, x9", WB: "ADD x4, x5, x6" },
      { cycle: 10, IF: "-", ID: "-", EX: "-", MEM: "-", WB: "SUB x7, x8, x9" }
    ],
    aiDiagnostic: "An unpipelined integer divider occupies the EX unit for 4 execution cycles (Cycles 3-6), forcing the hazard unit to freeze ID and IF stages. To mitigate multi-cycle execution bottlenecks, integrate fully pipelined dividers/multipliers or out-of-order reservation stations with separate functional unit pipelines.",
    hardwareStagesPerCycle: {
      1: {
        cycle: 1,
        IF: { pc: "0x00400000", instHex: "0x0220C1B3", instText: "DIV x3, x1, x2", status: "Active", details: "PC: 0x00400000 (Fetch DIV)" },
        ID: { status: "Idle", details: "No decode" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      2: {
        cycle: 2,
        IF: { pc: "0x00400004", instHex: "0x00628233", instText: "ADD x4, x5, x6", status: "Active", details: "PC: 0x00400004 (Fetch ADD)" },
        ID: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Decoding", details: "rs1=x1 (100), rs2=x2 (5), rd=x3" },
        EX: { status: "Idle", details: "ALU idle" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      3: {
        cycle: 3,
        IF: { pc: "0x00400008", instHex: "0x409403B3", instText: "SUB x7, x8, x9", status: "Active", details: "PC: 0x00400008 (Fetch SUB)" },
        ID: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Decoding", details: "rs1=x5 (14), rs2=x6 (16), rd=x4" },
        EX: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Computing", details: "Radix-2 Non-Restoring Divider (Iter 1/4)", extraBadge: "DIV Busy (1/4)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      4: {
        cycle: 4,
        IF: { pc: "0x00400008", status: "Stalled", details: "Hazard unit hold PC (Divider Busy)" },
        ID: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Stalled", details: "Hold ADD in ID (EX stage occupied)" },
        EX: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Computing", details: "Radix-2 Divider (Iter 2/4)", extraBadge: "DIV Busy (2/4)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      5: {
        cycle: 5,
        IF: { pc: "0x00400008", status: "Stalled", details: "Hazard unit hold PC (Divider Busy cycle 2)" },
        ID: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Stalled", details: "Hold ADD in ID stage" },
        EX: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Computing", details: "Radix-2 Divider (Iter 3/4)", extraBadge: "DIV Busy (3/4)" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      6: {
        cycle: 6,
        IF: { pc: "0x00400008", status: "Stalled", details: "Hazard unit hold PC (Divider Busy cycle 3)" },
        ID: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Stalled", details: "Hold ADD in ID stage" },
        EX: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Computing", details: "Radix-2 Divider (Iter 4/4): 100 / 5 = 20", extraBadge: "Quotient Ready" },
        MEM: { status: "Idle", details: "No memory access" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      7: {
        cycle: 7,
        IF: { status: "Idle", details: "All instructions in flight" },
        ID: { pc: "0x00400008", instText: "SUB x7, x8, x9", status: "Decoding", details: "rs1=x8 (50), rs2=x9 (18), rd=x7" },
        EX: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Computing", details: "ALU: 14 + 16 = 30" },
        MEM: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Pass-through", details: "Quotient 20 -> MEM/WB" },
        WB: { status: "Idle", details: "No writeback" },
        registers: { x1: 100, x2: 5, x3: 0, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      8: {
        cycle: 8,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { pc: "0x00400008", instText: "SUB x7, x8, x9", status: "Computing", details: "ALU: 50 - 18 = 32" },
        MEM: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Pass-through", details: "Val: 30 -> MEM/WB" },
        WB: { pc: "0x00400000", instText: "DIV x3, x1, x2", status: "Writeback", details: "Regfile[x3] <= 20 (DIV Result Committed)" },
        registers: { x1: 100, x2: 5, x3: 20, x4: 0, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      9: {
        cycle: 9,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { pc: "0x00400008", instText: "SUB x7, x8, x9", status: "Pass-through", details: "Val: 32 -> MEM/WB" },
        WB: { pc: "0x00400004", instText: "ADD x4, x5, x6", status: "Writeback", details: "Regfile[x4] <= 30" },
        registers: { x1: 100, x2: 5, x3: 20, x4: 30, x5: 14, x6: 16, x7: 0, x8: 50, x9: 18 }
      },
      10: {
        cycle: 10,
        IF: { status: "Idle", details: "-" },
        ID: { status: "Idle", details: "-" },
        EX: { status: "Idle", details: "-" },
        MEM: { status: "Idle", details: "-" },
        WB: { pc: "0x00400008", instText: "SUB x7, x8, x9", status: "Writeback", details: "Regfile[x7] <= 32" },
        registers: { x1: 100, x2: 5, x3: 20, x4: 30, x5: 14, x6: 16, x7: 32, x8: 50, x9: 18 }
      }
    }
  }
];
