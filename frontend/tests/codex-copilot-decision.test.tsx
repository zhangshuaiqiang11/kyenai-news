/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CodexCopilotDecisionTool } from "../components/CodexCopilotDecisionTool";
import { codexCopilotQuestions, scoreCodexCopilotDecision } from "../lib/codex-copilot-decision";

afterEach(cleanup);

describe("CodexCopilotDecisionTool", () => {
  it("starts neutral and labels the score as workflow decision support", () => {
    render(<CodexCopilotDecisionTool />);

    expect(screen.getByRole("heading", { name: /Should your team start with Codex or GitHub Copilot/i })).toBeTruthy();
    expect(screen.getByText(/Run a controlled two-tool pilot/i)).toBeTruthy();
    expect(screen.getByText(/Score operating fit, not model intelligence/i)).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(codexCopilotQuestions.length * 3);
  });

  it("recommends Codex after several Codex-aligned answers and resets", () => {
    render(<CodexCopilotDecisionTool />);

    fireEvent.click(screen.getByLabelText(/Codex app, ChatGPT, or CLI/i));
    fireEvent.click(screen.getByLabelText(/Root and nested AGENTS.md/i));
    expect(screen.getByText(/Start the pilot with Codex/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Reset answers/i }));
    expect(screen.getByText(/Run a controlled two-tool pilot/i)).toBeTruthy();
  });

  it("scores Copilot-oriented governance without claiming a quality winner", () => {
    const answers = Object.fromEntries(codexCopilotQuestions.map((question) => [question.id, "copilot"] as const));
    expect(scoreCodexCopilotDecision(answers)).toEqual({
      codexPoints: 0,
      copilotPoints: 12,
      answered: 6,
      recommendation: "copilot",
    });
  });
});
