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
        <p>Verified from publisher documentation on July 14, 2026.</p>
      </div>

      <aside
        className="instruction-direct-answer"
        role="note"
        aria-label="Direct answer"
      >
        <strong>Direct answer</strong>
        <p>
          Copilot support for <code>CLAUDE.md</code> depends on the surface. Keep
          it for Claude Code, supported Copilot cloud-agent surfaces, and Copilot CLI, but use{" "}
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
              <th scope="col">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {toolInstructionSupport.map((record) => (
              <tr key={record.id}>
                <th scope="row" data-label="Tool">
                  {record.toolName}
                </th>
                <td data-label="File or pattern">
                  <code>{record.path}</code>
                </td>
                <td data-label="Status">
                  <span className={`instruction-status instruction-status-${record.status}`}>
                    {statusLabels[record.status]}
                  </span>
                </td>
                <td data-label="Surfaces">{record.surfaces.join(", ")}</td>
                <td data-label="Scope and recommendation">
                  <p>{record.nesting}</p>
                  <p className="instruction-cell-recommendation">{record.recommendation}</p>
                </td>
                <td data-label="Evidence">
                  <a href={record.sourceUrl} rel="noreferrer" target="_blank">
                    Publisher source
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CopilotClaudeSurfaceMatrix() {
  const broadBaseline = toolInstructionSupport.find(({ id }) => id === "copilot-repository-instructions");
  const claudeSupported = toolInstructionSupport.find(({ id }) => id === "copilot-claude-md-documented-surfaces");
  const claudeUnsupported = toolInstructionSupport.find(({ id }) => id === "copilot-claude-md-unlisted-surfaces");
  const surfaces = Array.from(new Set([
    ...(broadBaseline?.surfaces ?? []),
    ...(claudeSupported?.surfaces ?? []),
    ...(claudeUnsupported?.surfaces ?? []),
  ]));

  return (
    <section className="instruction-resource-section" aria-labelledby="copilot-claude-surface-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">GitHub Copilot by exact environment</p>
          <h2 id="copilot-claude-surface-heading">CLAUDE.md support matrix by surface</h2>
        </div>
        <p>Verified from GitHub documentation on July 14, 2026.</p>
      </div>
      <div className="instruction-table-scroll">
        <table aria-label="GitHub Copilot CLAUDE.md support by exact surface">
          <thead>
            <tr>
              <th scope="col">Copilot surface</th>
              <th scope="col">CLAUDE.md</th>
              <th scope="col">.github/copilot-instructions.md</th>
              <th scope="col">Recommended baseline</th>
              <th scope="col">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {surfaces.map((surface) => {
              const supportsClaude = claudeSupported?.surfaces.includes(surface) ?? false;
              const explicitlyUnsupported = claudeUnsupported?.surfaces.includes(surface) ?? false;
              const supportsBroadBaseline = broadBaseline?.surfaces.includes(surface) ?? false;
              return (
                <tr key={surface}>
                  <th scope="row" data-label="Copilot surface">{surface}</th>
                  <td data-label="CLAUDE.md">{supportsClaude ? "Documented" : explicitlyUnsupported ? "Not listed" : "Verify"}</td>
                  <td data-label=".github/copilot-instructions.md">{supportsBroadBaseline ? "Documented" : "Not listed"}</td>
                  <td data-label="Recommended baseline">
                    {supportsBroadBaseline ? ".github/copilot-instructions.md" : supportsClaude ? "CLAUDE.md, with surface testing" : "Check the current matrix"}
                  </td>
                  <td data-label="Evidence">
                    <a href={claudeSupported?.sourceUrl} rel="noreferrer" target="_blank">GitHub support matrix</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
