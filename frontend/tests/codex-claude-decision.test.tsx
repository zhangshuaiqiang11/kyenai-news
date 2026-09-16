/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CodexClaudeDecisionTool } from "../components/CodexClaudeDecisionTool";
import { codingAgentDecisionQuestions, scoreCodingAgentDecision } from "../lib/codex-claude-decision";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

afterEach(cleanup);

describe("Codex vs Claude Code decision tool", () => {
  it("keeps an incomplete or mixed decision in controlled-pilot mode", () => {
    expect(scoreCodingAgentDecision({ workspace: "codex", instructions: "claude" })).toMatchObject({
      codexPoints: 2,
      claudePoints: 2,
      recommendation: "pilot",
    });
  });

  it("renders five workflow questions without universal-better claims", () => {
    render(<CodexClaudeDecisionTool />);

    expect(screen.getAllByRole("group")).toHaveLength(codingAgentDecisionQuestions.length);
    expect(screen.getByRole("heading", { name: /should your team start with codex or claude code/i })).toBeTruthy();
    expect(screen.getByText(/does not claim that either model is universally better or faster/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /run a controlled two-tool pilot/i })).toBeTruthy();
  });

  it("recommends the starting tool from explicit workflow choices and can reset", () => {
    render(<CodexClaudeDecisionTool />);

    fireEvent.click(screen.getByLabelText(/OpenAI app, IDE, or cloud/i));
    fireEvent.click(screen.getByLabelText(/^AGENTS\.md/i));
    expect(screen.getByRole("heading", { name: /start the pilot with codex/i })).toBeTruthy();
    expect(screen.getByText("4", { selector: "dd" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /reset answers/i }));
    expect(screen.getByRole("heading", { name: /run a controlled two-tool pilot/i })).toBeTruthy();
    expect(screen.getByText(`0 / ${codingAgentDecisionQuestions.length}`)).toBeTruthy();
  });
});
