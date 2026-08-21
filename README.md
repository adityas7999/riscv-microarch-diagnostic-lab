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
