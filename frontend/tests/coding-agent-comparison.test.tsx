// @vitest-environment jsdom

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AiCodingAgentComparisonTool } from "../components/AiCodingAgentComparisonTool";
import { codingAgentComparisonQuestions, scoreCodingAgentComparison } from "../lib/coding-agent-comparison";

describe("AI coding agent comparison tool", () => {
  it("keeps the initial result neutral", () => {
    expect(scoreCodingAgentComparison({})).toMatchObject({ answered: 0, leaders: [] });
  });

  it("returns a tie instead of inventing a winner", () => {
    const result = scoreCodingAgentComparison({
      "starting-surface": "codex",
      instructions: "claude",
    });
    expect(result.leaders).toEqual(["codex", "claude"]);
  });

  it("renders all five questions and updates the shortlist", () => {
    render(<AiCodingAgentComparisonTool />);
    expect(screen.getAllByRole("group")).toHaveLength(codingAgentComparisonQuestions.length);
    fireEvent.click(screen.getAllByLabelText(/OpenAI agent workspace/i)[0]);
    fireEvent.click(screen.getByLabelText(/AGENTS\.md/i));
    fireEvent.click(screen.getByLabelText(/Threads and worktrees/i));
    expect(screen.getByRole("heading", { name: /Pilot Codex first/i })).toBeTruthy();
    expect(screen.getByText(/not model intelligence/i)).toBeTruthy();
  });
});
