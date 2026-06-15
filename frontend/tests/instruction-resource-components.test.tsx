/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BenchmarkPanel } from "../components/BenchmarkPanel";
import { InstructionCompatibilityMatrix } from "../components/InstructionCompatibilityMatrix";
import { InstructionScopeGuide } from "../components/InstructionScopeGuide";
import { RepositoryTree } from "../components/RepositoryTree";
import { TemplateDownloads } from "../components/TemplateDownloads";
import {
  benchmarkProtocol,
  instructionTemplates,
  repositoryTree,
} from "../lib/instruction-resources";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

afterEach(cleanup);

describe("instruction resource components", () => {
  it("renders a surface-aware compatibility matrix and direct answer", () => {
    render(<InstructionCompatibilityMatrix />);

    const table = screen.getByRole("table", { name: /instruction file compatibility/i });
    for (const tool of ["Codex", "Claude Code", "GitHub Copilot", "Cursor"]) {
      expect(within(table).getAllByText(new RegExp(tool, "i")).length).toBeGreaterThan(0);
    }

    const directAnswer = screen.getByRole("note", { name: /direct answer/i });
    expect(directAnswer.textContent).toMatch(
      /Copilot support for CLAUDE\.md depends on (the )?surface/i,
    );
    expect(directAnswer.textContent).toContain(".github/copilot-instructions.md");

    const currentCursorRow = within(table)
      .getByText(".cursor/rules/*.mdc")
      .closest("tr");
    const legacyCursorRow = within(table).getByText(".cursorrules").closest("tr");

    expect(currentCursorRow).not.toBeNull();
    expect(legacyCursorRow).not.toBeNull();
    expect(currentCursorRow).not.toBe(legacyCursorRow);
    expect(currentCursorRow?.textContent).toMatch(/documented|current/i);
    expect(legacyCursorRow?.textContent).toMatch(/unknown/i);
    expect(legacyCursorRow?.textContent).toMatch(/current documentation/i);
  });

  it("explains canonical source, priority, and tool-specific scope from the records", () => {
    const { container } = render(<InstructionScopeGuide />);

    expect(screen.getByRole("heading", { name: /instruction scope guide/i })).toBeTruthy();
    expect(screen.getByText(/^canonical source$/i, { selector: "dt" })).toBeTruthy();
    expect(screen.getByText(/file priority and scope/i)).toBeTruthy();
    expect(screen.getByText(/Codex discovery/i)).toBeTruthy();
    expect(screen.getByText(/Claude scope/i)).toBeTruthy();
    expect(screen.getByText(/Copilot repository and path files/i)).toBeTruthy();
    expect(screen.getByText(/Cursor current and legacy files/i)).toBeTruthy();

    const guide = container.querySelector("dl");
    expect(guide).not.toBeNull();
    const guideText = guide?.textContent ?? "";
    expect(guideText).toContain("AGENTS.override.md");
    expect(guideText).toContain("CLAUDE.md");
    expect(guideText).toContain(".github/copilot-instructions.md");
    expect(guideText).toContain(".github/instructions/*.instructions.md");
    expect(guideText).toContain(".cursor/rules");
    expect(guideText).toContain(".cursorrules");
  });

  it("renders the repository tree as visible semantic preformatted code", () => {
    const { container } = render(<RepositoryTree />);
    const code = container.querySelector("pre > code");

    expect(code).not.toBeNull();
    expect(code?.parentElement?.tagName).toBe("PRE");
    expect(code?.textContent).toBe(repositoryTree);
  });

  it("offers all four templates as exact downloadable resource links with full previews", () => {
    render(<TemplateDownloads />);

    const links = screen.getAllByRole("link", { name: /download/i });
    expect(links).toHaveLength(4);

    for (const template of instructionTemplates) {
      const link = screen.getByRole("link", {
        name: new RegExp(`download ${template.downloadName.replace(".", "\\.")}`, "i"),
      });

      expect(link.getAttribute("href")).toBe(
        `/resources/instruction-files/${template.downloadName}`,
      );
      expect(link.hasAttribute("download")).toBe(true);
      expect(screen.getByText(template.purpose)).toBeTruthy();
      expect(screen.getByText(template.cautions[0])).toBeTruthy();
      expect(document.body.textContent).toContain(template.body.trim().split("\n")[0]);
      expect(document.body.textContent).toContain(template.body.trim().split("\n").slice(-1)[0]);
    }
  });

  it("shows the benchmark protocol and hides the empty results table", () => {
    const { container } = render(<BenchmarkPanel />);

    expect(
      screen.getByRole("heading", { name: /same-repository benchmark/i }),
    ).toBeTruthy();
    expect(screen.getByText(/^Task$/i)).toBeTruthy();
    expect(screen.getByText(/^Success criteria$/i)).toBeTruthy();
    expect(screen.getByRole("note", { name: /benchmark status/i })).toBeTruthy();
    expect(screen.getByText(/benchmark not yet run/i)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /benchmark-results\.json/i }).getAttribute("href"),
    ).toBe("/resources/instruction-files/benchmark-results.json");
    expect(screen.queryByRole("table", { name: /benchmark results/i })).toBeNull();
    expect(container.textContent).not.toContain("$0");
    expect(container.textContent).not.toContain("0 seconds");
    expect(container.textContent).not.toContain("0 interventions");
    expect(benchmarkProtocol.runs.every((run) => run.metricSource === "unavailable")).toBe(true);
  });
});
