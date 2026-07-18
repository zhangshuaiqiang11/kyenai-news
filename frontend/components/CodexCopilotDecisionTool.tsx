import React, { useMemo, useState } from "react";

import {
  codexCopilotQuestions,
  scoreCodexCopilotDecision,
  type CodexCopilotChoice,
} from "../lib/codex-copilot-decision";

const recommendationCopy = {
  codex: {
    title: "Start the pilot with Codex",
    body: "Your operating model leans toward OpenAI-native agent work, isolated worktrees, and AGENTS.md. Run one bounded task in Copilot before standardizing.",
  },
  copilot: {
    title: "Start the pilot with GitHub Copilot",
    body: "Your operating model leans toward GitHub-native administration, editor coverage, instruction surfaces, and model choice. Run the same task in Codex before standardizing.",
  },
  pilot: {
    title: "Run a controlled two-tool pilot",
    body: "The workflow is mixed. Use the same commit, prompt, permissions, and verification command; record review effort and unavailable metrics without estimates.",
  },
} as const;

export function CodexCopilotDecisionTool() {
  const [answers, setAnswers] = useState<Record<string, CodexCopilotChoice>>({});
  const score = useMemo(() => scoreCodexCopilotDecision(answers), [answers]);
  const recommendation = recommendationCopy[score.recommendation];

  return (
    <section className="instruction-resource-section coding-agent-decision" aria-labelledby="codex-copilot-decision-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Six-question browser tool</p>
          <h2 id="codex-copilot-decision-heading">Should your team start with Codex or GitHub Copilot?</h2>
        </div>
        <p>Score operating fit, not model intelligence. Product behavior and plan allowances can change.</p>
      </div>

      <div className="coding-agent-decision-grid">
        <form className="coding-agent-decision-form">
          {codexCopilotQuestions.map((question, questionIndex) => (
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

        <aside className="coding-agent-decision-result" aria-live="polite" aria-label="Codex or GitHub Copilot recommendation">
          <p className="instruction-resource-eyebrow">Current recommendation</p>
          <h3>{recommendation.title}</h3>
          <p>{recommendation.body}</p>
          <dl>
            <div><dt>Codex fit</dt><dd>{score.codexPoints}</dd></div>
            <div><dt>GitHub Copilot fit</dt><dd>{score.copilotPoints}</dd></div>
            <div><dt>Answered</dt><dd>{score.answered} / {codexCopilotQuestions.length}</dd></div>
          </dl>
          <small>Decision support only. Verify current plans, models, data policy, permissions, and enterprise controls with the linked official sources.</small>
        </aside>
      </div>
    </section>
  );
}
