import Link from "next/link";
import React, { useMemo, useState } from "react";

import {
  claudeCodeAlternativeOptions,
  getClaudeCodeAlternative,
  type ClaudeCodeAlternativeId,
} from "../lib/claude-code-alternatives";

const comparisonLinks: Partial<Record<ClaudeCodeAlternativeId, { href: string; label: string }>> = {
  stay: { href: "/guides/claude-code-hooks-mcp-setup", label: "Improve the current Claude Code workflow" },
  codex: { href: "/guides/codex-vs-claude-code", label: "Open the Codex vs Claude Code comparison" },
  copilot: { href: "/guides/codex-vs-github-copilot", label: "Compare the GitHub control plane" },
  cursor: { href: "/guides/local-vs-cloud-ai-coding-agent", label: "Compare local and cloud execution" },
  gemini: { href: "/guides/antigravity-cli-gemini-cli-migration", label: "Review the Gemini CLI migration path" },
  cline: { href: "/guides/secure-mcp-servers-ai-coding-agents", label: "Secure provider and MCP access" },
  aider: { href: "/guides/loop-engineering-ai-coding-agents", label: "Design a bounded terminal-agent loop" },
  opencode: { href: "/guides/agents-md-template-for-ai-coding-agents", label: "Start with a tested AGENTS.md policy" },
};

export function ClaudeCodeAlternativesTool() {
  const [selectedId, setSelectedId] = useState<ClaudeCodeAlternativeId | undefined>();
  const selected = useMemo(() => getClaudeCodeAlternative(selectedId), [selectedId]);
  const nextLink = selected ? comparisonLinks[selected.id] : undefined;

  return (
    <section className="instruction-resource-section coding-agent-decision" aria-labelledby="claude-alternatives-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Reason-to-switch selector</p>
          <h2 id="claude-alternatives-heading">Which Claude Code alternative should you pilot?</h2>
        </div>
        <p>Choose the workflow constraint you need to change. This recommends a pilot starting point, not a universal winner.</p>
      </div>

      <div className="coding-agent-decision-grid">
        <form className="coding-agent-decision-form">
          <fieldset>
            <legend><span>1</span>What is the main reason you are considering a switch?</legend>
            <div className="coding-agent-choice-list">
              {claudeCodeAlternativeOptions.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="switch-reason"
                    value={option.id}
                    checked={selectedId === option.id}
                    onChange={() => setSelectedId(option.id)}
                  />
                  <span><strong>{option.label}</strong><small>{option.trigger}</small></span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" onClick={() => setSelectedId(undefined)}>Reset selection</button>
        </form>

        <aside className="coding-agent-decision-result" aria-live="polite" aria-label="Claude Code alternative result">
          <p className="instruction-resource-eyebrow">Pilot starting point</p>
          <h3>{selected ? selected.label : "Select the constraint you need to change"}</h3>
          <p>{selected ? selected.fit : "If Claude Code already passes verification with acceptable cost, permissions, and review effort, staying is a valid result."}</p>
          {selected ? (
            <dl>
              <div><dt>Main tradeoff</dt><dd>Verify</dd></div>
              <div><dt>Verdict type</dt><dd>Pilot</dd></div>
            </dl>
          ) : null}
          {selected ? <p><strong>Next step:</strong> {selected.nextStep}</p> : null}
          {selected ? <small>{selected.tradeoff}</small> : null}
          {nextLink ? <Link href={nextLink.href}>{nextLink.label}</Link> : null}
        </aside>
      </div>
    </section>
  );
}
