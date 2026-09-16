// @vitest-environment jsdom

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClaudeCodeAlternativesTool } from "../components/ClaudeCodeAlternativesTool";
import { claudeCodeAlternativeOptions, getClaudeCodeAlternative } from "../lib/claude-code-alternatives";

describe("Claude Code alternatives selector", () => {
  it("keeps staying with Claude Code as an explicit neutral option", () => {
    expect(getClaudeCodeAlternative("stay")?.label).toBe("Stay with Claude Code");
    expect(getClaudeCodeAlternative("unknown")).toBeUndefined();
  });

  it("renders all workflow choices and recommends a pilot", () => {
    render(<ClaudeCodeAlternativesTool />);

    expect(screen.getAllByRole("radio")).toHaveLength(claudeCodeAlternativeOptions.length);
    expect(screen.getByRole("heading", { name: /Select the constraint/i })).toBeTruthy();
    fireEvent.click(screen.getByLabelText(/OpenAI-native command center/i));
    expect(screen.getByRole("heading", { name: "Codex" })).toBeTruthy();
    expect(screen.getByText(/Open the Codex vs Claude Code comparison/i)).toBeTruthy();
    expect(screen.getByText(/recommends a pilot starting point/i)).toBeTruthy();
  });
});
