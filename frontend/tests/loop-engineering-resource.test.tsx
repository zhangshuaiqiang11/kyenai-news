/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoopEngineeringResources } from "../components/LoopEngineeringResources";
import { LoopPatternMatrix } from "../components/LoopPatternMatrix";
import { loopBuildingBlocks, loopPatterns, loopStopRules, loopWorkflowSteps } from "../lib/loop-engineering-resource";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

afterEach(cleanup);

describe("loop engineering resource components", () => {
  it("renders a pattern matrix with a direct answer and six patterns", () => {
    render(<LoopPatternMatrix />);

    const table = screen.getByRole("table", { name: /loop engineering patterns/i });
    expect(within(table).getAllByRole("row")).toHaveLength(loopPatterns.length + 1);

    const directAnswer = screen.getByRole("note", { name: /direct answer/i });
    expect(directAnswer.textContent).toMatch(/act → observe → reason/i);
    expect(directAnswer.textContent).toMatch(/stop rules/i);

    for (const pattern of ["Plan → execute → verify", "Human-in-the-loop checkpoint"]) {
      expect(within(table).getByText(pattern)).toBeTruthy();
    }
  });

  it("renders the workflow, pseudo-code, stop rules, and building blocks", () => {
    render(<LoopEngineeringResources />);

    expect(screen.getByRole("heading", { name: /plan, act, observe, verify, retry or stop/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /loop engineering pattern matrix/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /bounded agent loop/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /when should an ai agent stop the loop/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /five loop building blocks/i })).toBeTruthy();

    for (const step of loopWorkflowSteps) {
      expect(screen.getByText(step.label)).toBeTruthy();
    }

    expect(screen.getByText(/max_iterations = 3/i)).toBeTruthy();
    expect(screen.getByText(/escalate\("human review"/i)).toBeTruthy();

    for (const rule of loopStopRules) {
      expect(screen.getByText(rule)).toBeTruthy();
    }

    for (const block of loopBuildingBlocks) {
      expect(screen.getByRole("heading", { name: block.title })).toBeTruthy();
    }
  });
});
