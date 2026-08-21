import { CycleTraceEntry, InstructionMatrixRow, PipelineStage } from '../types';

export function computeMatrixRows(code: string, trace: CycleTraceEntry[]): InstructionMatrixRow[] {
  // Extract distinct instructions from code (stripping full comments, inline comments, and label lines)
  const codeLines = code
    .split('\n')
    .map(line => {
      const withoutComment = line.split('#')[0].split('//')[0].trim();
      return withoutComment;
    })
    .filter(line => line && !line.endsWith(':')); // filter out empty and label lines

  // Also harvest any distinct instructions appearing in the trace
  const instructionSet = new Set<string>();
  codeLines.forEach(inst => instructionSet.add(inst));

  // Build row map
  const rows: InstructionMatrixRow[] = [];
  const registeredInsts: string[] = [];

  // Add all code instructions in order
  for (const inst of codeLines) {
    if (!registeredInsts.includes(inst)) {
      registeredInsts.push(inst);
      rows.push({
        instruction: inst,
        stages: {}
      });
    }
  }

  // Iterate over each cycle in the trace
  for (const entry of trace) {
    const cycle = entry.cycle;
    const stages: Array<{ stage: PipelineStage; raw: string }> = [
      { stage: 'IF', raw: entry.IF },
      { stage: 'ID', raw: entry.ID },
      { stage: 'EX', raw: entry.EX },
      { stage: 'MEM', raw: entry.MEM },
      { stage: 'WB', raw: entry.WB }
    ];

    for (const { stage, raw } of stages) {
      if (!raw || raw === '-') continue;

      // Check if it's a stall or flush without a clean instruction tag
      const isStall = raw.toLowerCase().includes('stall') || raw === '--';
      const isFlush = raw.toLowerCase().includes('flush');
      const isFreeze = raw.toLowerCase().includes('freeze');
      const isNOP = raw.toLowerCase().includes('nop');
      const hasForwarding = raw.toLowerCase().includes('fwd') || raw.toLowerCase().includes('forward');

      // Find which row this instruction belongs to
      let matchedRow: InstructionMatrixRow | undefined;

      // Try exact or prefix match against registered instructions
      for (const row of rows) {
        // Strip out annotations like (fwd x1) or (Taken) or [D$ Miss]
        const cleanRaw = raw
          .replace(/\(fwd[^)]*\)/gi, '')
          .replace(/\([^)]*\)/gi, '')
          .replace(/\[[^\]]*\]/gi, '')
          .trim();

        if (
          cleanRaw === row.instruction ||
          row.instruction.startsWith(cleanRaw) ||
          cleanRaw.startsWith(row.instruction) ||
          (row.instruction.split(' ')[0] === cleanRaw.split(' ')[0] && cleanRaw.includes(row.instruction.split(' ')[1] || ''))
        ) {
          matchedRow = row;
          break;
        }
      }

      // If stall or flush happened for an instruction in ID/EX
      if (!matchedRow && (isStall || isFreeze)) {
        // assign to the instruction currently waiting
        // Usually the second or latest active instruction
        if (rows.length > 1 && !rows[1].stages[cycle]) {
          matchedRow = rows[1];
        }
      }

      if (matchedRow) {
        matchedRow.stages[cycle] = {
          stage: isStall ? 'STALL' : isFlush ? 'FLUSH' : isFreeze ? 'FREEZE' : isNOP ? 'NOP' : stage,
          rawText: raw,
          hasForwarding,
          forwardingNote: hasForwarding ? raw : undefined,
          isStall: isStall || isFreeze,
          isFlush
        };
      }
    }
  }

  // Ensure stalls in ID stage are properly marked for the delayed instructions
  rows.forEach((row, rIdx) => {
    trace.forEach(entry => {
      const cycle = entry.cycle;
      if (!row.stages[cycle]) {
        // If row is in between IF and EX but has no explicit stage, check trace for stall or bubble
        const hasPrev = row.stages[cycle - 1];
        const hasNext = row.stages[cycle + 1];
        if (hasPrev && (hasPrev.stage === 'IF' || hasPrev.stage === 'ID' || hasPrev.stage === 'STALL')) {
          if (entry.IF === 'stall' || entry.ID.includes(row.instruction) || entry.EX.includes('NOP') || entry.EX.includes('Freeze')) {
            row.stages[cycle] = {
              stage: 'STALL',
              rawText: entry.IF === 'stall' ? 'Stall' : entry.EX.includes('Freeze') ? 'Freeze' : '--',
              isStall: true
            };
          }
        }
      }
    });
  });

  return rows;
}
