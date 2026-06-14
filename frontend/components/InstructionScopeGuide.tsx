import React from "react";

import { toolInstructionSupport } from "../lib/instruction-resources";

const getRecord = (id: string) => {
  const record = toolInstructionSupport.find((candidate) => candidate.id === id);

  if (!record) {
    throw new Error(`Missing instruction support record: ${id}`);
  }

  return record;
};

export function InstructionScopeGuide() {
  const codex = getRecord("codex-agents-md");
  const claude = getRecord("claude-code-claude-md");
  const copilotRepository = getRecord("copilot-repository-instructions");
  const cursorCurrent = getRecord("cursor-project-rules");
  const cursorLegacy = getRecord("cursor-cursorrules-status-unknown");

  return (
    <section className="instruction-resource-section" aria-labelledby="instruction-scope-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Placement and precedence</p>
          <h2 id="instruction-scope-heading">Instruction scope guide</h2>
        </div>
      </div>

      <dl className="instruction-scope-list">
        <div>
          <dt>Canonical source</dt>
          <dd>
            Treat each tool&apos;s currently documented file as its canonical
            source: root <code>AGENTS.md</code> for shared Codex rules, root{" "}
            <code>CLAUDE.md</code> for stable Claude Code commands,{" "}
            <code>.github/copilot-instructions.md</code> for the broad Copilot
            baseline, and focused <code>.cursor/rules/*.mdc</code> files for
            Cursor.
          </dd>
        </div>

        <div>
          <dt>File priority and scope</dt>
          <dd>
            <p>{codex.priority}</p>
            <p>{codex.nesting}</p>
          </dd>
        </div>

        <div>
          <dt>Codex discovery</dt>
          <dd>
            <p>{codex.recommendation}</p>
            <p>Supported scopes: {codex.scopes.join(", ")}.</p>
          </dd>
        </div>

        <div>
          <dt>Claude scope</dt>
          <dd>
            <p>{claude.priority}</p>
            <p>{claude.nesting}</p>
          </dd>
        </div>

        <div>
          <dt>Copilot repository and path files</dt>
          <dd>
            <p>{copilotRepository.priority}</p>
            <p>{copilotRepository.nesting}</p>
          </dd>
        </div>

        <div>
          <dt>Cursor current and legacy files</dt>
          <dd>
            <p>
              Current: <code>{cursorCurrent.path}</code>. {cursorCurrent.priority}{" "}
              {cursorCurrent.nesting}
            </p>
            <p>
              Legacy-status caveat: <code>{cursorLegacy.path}</code>.{" "}
              {cursorLegacy.priority} {cursorLegacy.recommendation}
            </p>
          </dd>
        </div>
      </dl>
    </section>
  );
}
