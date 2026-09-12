/** @vitest-environment jsdom */
import React from "react";
import fs from "node:fs";
import path from "node:path";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoopEngineeringResources } from "../components/LoopEngineeringResources";
import { LoopBudgetCalculator } from "../components/LoopBudgetCalculator";
import { LoopPatternMatrix } from "../components/LoopPatternMatrix";
import {
  calculateLoopBudget,
  loopBuildingBlocks,
  loopPatterns,
  loopProofContractDownload,
  loopProofGateChecks,
  loopStopRules,
  loopWorkflowSteps,
} from "../lib/loop-engineering-resource";

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
    expect(screen.getByRole("heading", { name: /agent loop budget calculator/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /evidence gate for an ai coding agent loop/i })).toBeTruthy();
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

    for (const gate of loopProofGateChecks) {
      expect(screen.getByRole("heading", { name: gate.title })).toBeTruthy();
    }

    const download = screen.getByRole("link", { name: /download proof-of-done-contract\.json/i });
    expect(download.getAttribute("href")).toBe(loopProofContractDownload);
    expect(download.hasAttribute("download")).toBe(true);
  });

  it("ships a valid proof-of-done contract with bounded gates and explicit terminal states", () => {
    const contractPath = path.join(process.cwd(), "public/resources/loop-engineering/proof-of-done-contract.json");
    const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

    expect(contract.templateVersion).toBe("1.1.0");
    expect(contract.trustBoundary).toMatch(/does not prove semantic program correctness/i);
    expect(contract.task.sourceRevision).toMatch(/git-sha/i);
    expect(contract.budgets.maxIterations).toBeGreaterThan(0);
    expect(contract.requiredGates).toHaveLength(3);
    expect(contract.requiredGates.every((gate: { mustMatchSourceRevision: boolean; mustBeFresh: boolean }) =>
      gate.mustMatchSourceRevision && gate.mustBeFresh,
    )).toBe(true);
    expect(contract.allowedTerminalStates).toEqual(expect.arrayContaining([
      "verified",
      "review-required",
      "blocked",
      "stopped-by-budget",
    ]));
  });

  it("calculates token, tool-call, cost, and risk ceilings deterministically", () => {
    expect(calculateLoopBudget({
      tokensPerIteration: 25_000,
      toolCallsPerIteration: 8,
      maxIterations: 5,
      costPerMillionTokens: 10,
      agentCount: 2,
    })).toMatchObject({
      maximumTokens: 250_000,
      maximumToolCalls: 80,
      maximumCostUsd: 2.5,
      risk: "Moderate",
    });
  });

  it("updates the browser calculator and flags high-exposure loops", () => {
    render(<LoopBudgetCalculator />);

    fireEvent.change(screen.getByLabelText(/maximum iterations/i), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText(/concurrent agents/i), { target: { value: "6" } });

    expect(screen.getByText("High", { selector: "dd" })).toBeTruthy();
    expect(screen.getByText(/human checkpoint before launch/i)).toBeTruthy();
  });
});
