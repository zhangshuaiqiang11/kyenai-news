import React from "react";
import Link from "next/link";

import { BenchmarkPanel } from "./BenchmarkPanel";
import { InstructionCompatibilityMatrix } from "./InstructionCompatibilityMatrix";
import { InstructionFileEvidenceSnapshot } from "./InstructionFileEvidenceSnapshot";
import { InstructionScopeGuide } from "./InstructionScopeGuide";
import { RepositoryTree } from "./RepositoryTree";
import { TemplateDownloads } from "./TemplateDownloads";

export function InstructionGuideResources() {
  return (
    <div className="guide-resource-sections">
      <section className="instruction-tool-cta" aria-labelledby="instruction-tool-cta-heading">
        <div>
          <p className="instruction-resource-eyebrow">Apply the comparison</p>
          <h2 id="instruction-tool-cta-heading">Audit your instruction file before rollout</h2>
          <p>
            Check setup commands, verification, scope, safety, placeholders, destructive commands, and the documented file path without uploading repository text.
          </p>
        </div>
        <Link href="/tools/instruction-file-checker">Open the instruction file checker</Link>
        <p className="instruction-evidence-refresh">
          <strong>Evidence refresh:</strong> GitHub&apos;s current support matrix includes Copilot CLI agent-file support, while Claude Code documents <code>@AGENTS.md</code> as an import from <code>CLAUDE.md</code>. Verified July 14, 2026.
        </p>
      </section>
      <InstructionFileEvidenceSnapshot />
      <InstructionCompatibilityMatrix />
      <InstructionScopeGuide />
      <RepositoryTree />
      <TemplateDownloads />
      <BenchmarkPanel />
    </div>
  );
}
