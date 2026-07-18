import Link from "next/link";
import React from "react";

import report from "../lib/data/instruction-file-adoption-report-2026-q3.json";

const number = new Intl.NumberFormat("en-US");

function getSummary(id: string) {
  const summary = report.querySummaries.find((candidate) => candidate.id === id);
  if (!summary) throw new Error(`Missing instruction-file adoption summary: ${id}`);
  return summary;
}

function getMissingShare(summary: ReturnType<typeof getSummary>, label: string) {
  return summary.commonMissingConfigurations.find((item) => item.label === label)?.sharePct ?? 0;
}

export function InstructionFileEvidenceSnapshot() {
  const agents = getSummary("agents-md");
  const claude = getSummary("claude-md");

  return (
    <section className="instruction-resource-section" aria-labelledby="instruction-evidence-snapshot-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Original data · {report.snapshotDate}</p>
          <h2 id="instruction-evidence-snapshot-heading">What public AGENTS.md and CLAUDE.md files actually contain</h2>
        </div>
        <p>
          Two 100-file GitHub best-match samples. Percentages describe the sample, not every public repository.
        </p>
      </div>

      <div className="instruction-direct-answer" role="note" aria-label="Instruction file evidence takeaway">
        <strong>Choose by reader support; improve both files by evidence.</strong>
        <p>
          File popularity does not decide which one your agent reads. The useful comparison is whether each file names
          executable tests, completion criteria, scope, and approval boundaries—and whether the target tool loads it.
        </p>
      </div>

      <div className="adoption-signal-grid">
        <article>
          <h3>AGENTS.md sample</h3>
          <dl>
            <div><dt>GitHub indexed file matches</dt><dd>{number.format(agents.githubFileMatches)}</dd></div>
            <div><dt>Files analyzed</dt><dd>{agents.readableFiles} readable best matches</dd></div>
            <div><dt>No security or approval rule detected</dt><dd>{getMissingShare(agents, "a security or approval rule")}%</dd></div>
            <div><dt>No verification criteria detected</dt><dd>{getMissingShare(agents, "verification or completion criteria")}%</dd></div>
            <div><dt>No explicit test command detected</dt><dd>{getMissingShare(agents, "an explicit test command")}%</dd></div>
          </dl>
        </article>
        <article>
          <h3>CLAUDE.md sample</h3>
          <dl>
            <div><dt>GitHub indexed file matches</dt><dd>{number.format(claude.githubFileMatches)}</dd></div>
            <div><dt>Files analyzed</dt><dd>{claude.readableFiles} readable best matches</dd></div>
            <div><dt>No security or approval rule detected</dt><dd>{getMissingShare(claude, "a security or approval rule")}%</dd></div>
            <div><dt>No verification criteria detected</dt><dd>{getMissingShare(claude, "verification or completion criteria")}%</dd></div>
            <div><dt>No explicit test command detected</dt><dd>{getMissingShare(claude, "an explicit test command")}%</dd></div>
          </dl>
        </article>
      </div>

      <p className="adoption-source-note">
        KyenAI&apos;s detection uses visible text patterns and does not test whether an agent followed a rule. A separate
        2026 preprint analyzing 100 popular repositories reported six configuration smells, led by lint leakage (62%),
        context bloat (42%), and skill leakage (35%). These are different samples and definitions, so the percentages
        should not be combined. Read the <Link href="/guides/ai-coding-agent-instruction-file-adoption-report-2026">full
        adoption report and methodology</Link> or the <a href="https://arxiv.org/abs/2606.15828" rel="noreferrer">configuration-smells preprint</a>.
      </p>
      <div className="mcp-download-links" aria-label="Download instruction-file evidence data">
        <a href="/resources/data/instruction-file-adoption-report-2026-q3.csv" download>Download 400-file CSV</a>
        <a href="/resources/data/instruction-file-adoption-report-2026-q3.json" download>Download JSON + methodology</a>
      </div>
    </section>
  );
}
