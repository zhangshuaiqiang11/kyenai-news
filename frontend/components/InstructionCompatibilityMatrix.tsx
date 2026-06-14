import React from "react";

import { toolInstructionSupport } from "../lib/instruction-resources";

const statusLabels = {
  documented: "Documented",
  legacy: "Legacy",
  observed: "Observed",
  unsupported: "Unsupported",
  unknown: "Unknown in current documentation",
} as const;

export function InstructionCompatibilityMatrix() {
  return (
    <section className="instruction-resource-section" aria-labelledby="instruction-compatibility-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Compatibility by surface</p>
          <h2 id="instruction-compatibility-heading">Instruction file compatibility</h2>
        </div>
        <p>Verified from publisher documentation on June 14, 2026.</p>
      </div>

      <aside
        className="instruction-direct-answer"
        role="note"
        aria-label="Direct answer"
      >
        <strong>Direct answer</strong>
        <p>
          Copilot support for <code>CLAUDE.md</code> depends on the surface. Keep
          it for Claude Code and supported Copilot cloud agent surfaces, but use{" "}
          <code>.github/copilot-instructions.md</code> as the broad-compatibility
          Copilot baseline.
        </p>
      </aside>

      <div className="instruction-table-scroll">
        <table aria-label="Instruction file compatibility">
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">File or pattern</th>
              <th scope="col">Status</th>
              <th scope="col">Surfaces</th>
              <th scope="col">Scope and recommendation</th>
            </tr>
          </thead>
          <tbody>
            {toolInstructionSupport.map((record) => (
              <tr key={record.id}>
                <th scope="row">{record.toolName}</th>
                <td>
                  <code>{record.path}</code>
                </td>
                <td>
                  <span className={`instruction-status instruction-status-${record.status}`}>
                    {statusLabels[record.status]}
                  </span>
                </td>
                <td>{record.surfaces.join(", ")}</td>
                <td>
                  <p>{record.nesting}</p>
                  <p className="instruction-cell-recommendation">{record.recommendation}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

