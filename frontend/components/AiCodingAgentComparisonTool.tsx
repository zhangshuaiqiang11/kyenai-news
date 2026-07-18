import Link from "next/link";
import React, { useMemo, useState } from "react";

import {
  codingAgentComparisonQuestions,
  codingAgentNames,
  scoreCodingAgentComparison,
  type CodingAgentId,
} from "../lib/coding-agent-comparison";

const deepComparisonLinks: Partial<Record<CodingAgentId, { href: string; label: string }>> = {
  codex: { href: "/guides/codex-vs-claude-code", label: "Compare Codex with Claude Code" },
  claude: { href: "/guides/claude-code-alternatives", label: "Compare Claude Code alternatives by workflow" },
  copilot: { href: "/guides/codex-vs-github-copilot", label: "Compare GitHub Copilot with Codex" },
  cursor: { href: "/guides/local-vs-cloud-ai-coding-agent", label: "Compare local and cloud execution" },
};

export function AiCodingAgentComparisonTool() {
  const [answers, setAnswers] = useState<Record<string, CodingAgentId>>({});
  const result = useMemo(() => scoreCodingAgentComparison(answers), [answers]);
  const leaderNames = result.leaders.map((id) => codingAgentNames[id]);
  const primaryLeader = result.leaders[0];
  const nextLink = primaryLeader ? deepComparisonLinks[primaryLeader] : undefined;
  const resultTitle = result.answered === 0
    ? "Answer the questions to build a shortlist"
    : result.leaders.length === 1
      ? `Pilot ${leaderNames[0]} first`
      : `Run a controlled pilot: ${leaderNames.join(" and ")}`;

  return (
    <section className="instruction-resource-section coding-agent-decision" aria-labelledby="coding-agent-comparison-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Five-question comparison tool</p>
          <h2 id="coding-agent-comparison-heading">Which coding-agent operating model fits your team?</h2>
        </div>
        <p>This scores documented workflow fit, not model intelligence, output quality, or benchmark performance.</p>
      </div>

      <div className="coding-agent-decision-grid">
        <form className="coding-agent-decision-form">
          {codingAgentComparisonQuestions.map((question, questionIndex) => (
            <fieldset key={question.id}>
              <legend><span>{questionIndex + 1}</span>{question.prompt}</legend>
              <div className="coding-agent-choice-list">
                {question.options.map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                    />
                    <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button type="button" onClick={() => setAnswers({})}>Reset answers</button>
        </form>

        <aside className="coding-agent-decision-result" aria-live="polite" aria-label="AI coding agent shortlist">
          <p className="instruction-resource-eyebrow">Current shortlist</p>
          <h3>{resultTitle}</h3>
          <p>Verify the shortlist with the same clean commit, task, instruction files, permissions, timebox, and test command. Keep unavailable metrics marked Not measured.</p>
          <dl>
            {(Object.keys(codingAgentNames) as CodingAgentId[]).map((id) => (
              <div key={id}><dt>{codingAgentNames[id]}</dt><dd>{result.scores[id]}</dd></div>
            ))}
            <div><dt>Answered</dt><dd>{result.answered} / {codingAgentComparisonQuestions.length}</dd></div>
          </dl>
          {nextLink ? <Link href={nextLink.href}>{nextLink.label}</Link> : null}
          <small>Decision support only. Recheck current product availability, models, data policy, permissions, plans, and enterprise controls on the linked official sources.</small>
        </aside>
      </div>
    </section>
  );
}
