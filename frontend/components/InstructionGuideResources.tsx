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
      <section className="instruction-resource-section" aria-labelledby="instruction-citation-entry-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Research and media citation entry</p>
            <h2 id="instruction-citation-entry-heading">Cite the 400-file instruction dataset</h2>
          </div>
          <p>Version 2026-Q3 · CC BY 4.0 for the published data and methodology · snapshot date July 14, 2026.</p>
        </div>
        <div className="instruction-direct-answer">
          <strong>Researcher summary</strong>
          <p>
            KyenAI analyzed the first 100 readable best matches for each of four public GitHub code-search queries:
            AGENTS.md, CLAUDE.md, Copilot instruction files, and Cursor rules. The 400-file sample supports comparisons
            inside the published sampling boundary; it does not estimate GitHub-wide adoption.
          </p>
        </div>
        <figure className="adoption-citation-card">
          <blockquote>KyenAI. (2026). AI Coding Agent Instruction File Adoption Report — Q3 2026 (Version 2026-Q3) [Data set]. https://www.kyenai.com/guides/ai-coding-agent-instruction-file-adoption-report-2026</blockquote>
          <figcaption>Media note: report file-match counts and sampled-file percentages separately, and keep the best-match limitation.</figcaption>
        </figure>
        <div className="mcp-download-links" aria-label="Download instruction research citation assets">
          <a href="/resources/data/instruction-file-adoption-report-2026-q3.csv" download>Download 400-file CSV</a>
          <a href="/resources/data/instruction-file-adoption-report-2026-q3.json" download>Download JSON dataset</a>
          <a href="/resources/data/instruction-file-adoption-report-2026-q3-methodology.md" download>Read methodology</a>
          <a href="/resources/data/instruction-file-adoption-report-2026-q3-citation.bib" download>Download BibTeX</a>
          <a href="/resources/data/instruction-file-adoption-report-2026-q3-citation.cff" download>Download CFF</a>
          <a href="/resources/data/instruction-file-adoption-report-2026-q3-manifest.json" download>Download manifest</a>
          <a href="/resources/data/instruction-file-adoption-report-2026-q3-sha256.txt" download>Verify SHA-256</a>
        </div>
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
