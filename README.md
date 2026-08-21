# ⚡ RISC-V Microarchitecture Diagnostic Lab

An interactive performance diagnostic dashboard and 5-stage in-order pipeline visualizer (IF, ID, EX, MEM, WB) for RISC-V (RV32I) architectures.

🔗 **Live App Demo**: (https://risc-v-microarchitecture-diagnostic-lab.ai.studio/)

---

## 🛠️ Key Capabilities
- **5-Stage Pipeline Modeling**: Interactive tracking across Instruction Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), and Writeback (WB).
- **Hazard Analysis**: Pre-modeled scenarios for RAW Data Hazards, Load-Use Delay Stalls, Branch Mispredictions, Structural Conflicts, and Forwarding Paths.
- **Cycle Execution Trace**: Dynamic cycle-by-cycle instruction progression matrix.
- **Hardware Telemetry & Diagnostics**: Real-time IPC calculation, cycle counting, and AI architectural optimization diagnostics.

---

## 🏗️ Tech Stack
- **Design & Layout**: Google Stitch
- **Synthesis & Logic**: Gemini 3.7 Flash via Google AI Studio
- **Frontend Architecture**: Vite + TypeScript + Tailwind CSS

---

## 💡 Usage Tips & Guide

- **Explore Pipeline Hazards**: Use the scenario selector at the top to toggle between different execution cases, including RAW Data Hazards, Branch Mispredictions, and Forwarding paths.
- **Inspect Cycle-by-Cycle Execution**: Track the progression of instructions across pipeline stages (`IF`, `ID`, `EX`, `MEM`, `WB`) in the Execution Trace matrix.
- **Analyze Telemetry Metrics**: Monitor real-time performance indicators such as total clock cycles, instruction count, and calculated **IPC (Instructions Per Cycle)**.
- **Review AI Diagnostic Recommendations**: Check the diagnostic panel for actionable architectural insights, hazard resolution suggestions, and optimization strategies.
- **Test Optimization Variants**: Compare unoptimized code sequences against forwarded or loop-unrolled alternatives to observe IPC throughput improvements.
