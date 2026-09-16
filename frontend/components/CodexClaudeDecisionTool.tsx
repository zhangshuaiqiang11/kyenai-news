import React, { useMemo, useState } from "react";

import {
  codingAgentDecisionQuestions,
  scoreCodingAgentDecision,
  type CodingAgentChoice,
} from "../lib/codex-claude-decision";

const recommendationCopy = {
  codex: {
    title: "Start the pilot with Codex",
    body: "Your selected workflow leans toward Codex. Run the same bounded repository task in Claude Code before standardizing, then compare verification, interventions, and review effort.",
  },
  claude: {
    title: "Start the pilot with Claude Code",
    body: "Your selected workflow leans toward Claude Code. Run the same bounded repository task in Codex before standardizing, then compare verification, interventions, and review effort.",
  },
  pilot: {
    title: "Run a controlled two-tool pilot",
    body: "The workflow is mixed or not fully specified. Use the same commit, prompt, permissions, and proof command in both tools; record unavailable metrics as Not measured.",
  },
} as const;

export function CodexClaudeDecisionTool() {
  const [answers, setAnswers] = useState<Record<string, CodingAgentChoice>>({});
  const score = useMemo(() => scoreCodingAgentDecision(answers), [answers]);
  const recommendation = recommendationCopy[score.recommendation];

  return (
    <section className="instruction-resource-section coding-agent-decision" aria-labelledby="coding-agent-decision-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Browser decision tool</p>
          <h2 id="coding-agent-decision-heading">Should your team start with Codex or Claude Code?</h2>
        </div>
        <p>Choose by workflow fit. This tool does not claim that either model is universally better or faster.</p>
      </div>

      <div className="coding-agent-decision-grid">
        <form className="coding-agent-decision-form">
          {codingAgentDecisionQuestions.map((question, questionIndex) => (
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

        <aside className="coding-agent-decision-result" aria-live="polite" aria-label="Coding agent recommendation">
          <p className="instruction-resource-eyebrow">Current recommendation</p>
          <h3>{recommendation.title}</h3>
          <p>{recommendation.body}</p>
          <dl>
            <div><dt>Codex fit</dt><dd>{score.codexPoints}</dd></div>
            <div><dt>Claude Code fit</dt><dd>{score.claudePoints}</dd></div>
            <div><dt>Answered</dt><dd>{score.answered} / {codingAgentDecisionQuestions.length}</dd></div>
          </dl>
          <small>Decision support only. Verify current product behavior, pricing, data policy, and enterprise controls with the linked official sources before rollout.</small>
        </aside>
      </div>
    </section>
  );
}
